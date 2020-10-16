import React, { useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { SearchHit } from './search-hit/SearchHit';
import { BEM } from '../../utils/bem';
import { Flatknapp } from 'nav-frontend-knapper';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import './SearchResults.less';
import {
    FacetBucketProps,
    SearchHitProps,
    SearchResultProps,
} from '../../types/search-result';
import { SearchParams } from '../../types/search-params';
import { fetchSearchResultsClientSide } from '../../fetch/search';
import Spinner from '../../components/spinner/Spinner';
import { LenkeNavNo } from '../../components/lenke/LenkeNavNo';
import { Config } from '../../config';

const filterByFacets = (
    hits: SearchHitProps[],
    facetBuckets: FacetBucketProps[]
) => {
    const selected = facetBuckets?.filter((bucket) => bucket.checked);

    const classes = (selected?.length > 0 ? selected : facetBuckets).map((uf) =>
        uf.key.toLowerCase()
    );

    return hits.filter((hit) =>
        classes?.includes(hit.className.toLowerCase().trim())
    );
};

const sortByDate = (a: SearchHitProps, b: SearchHitProps) => {
    const lastChanged = (props: SearchHitProps) =>
        Math.max(
            ...[
                props.publish.first,
                props.publish.from,
                props.modifiedTime,
                0,
            ].map((v) => dayjs(v).unix())
        );

    return lastChanged(b) - lastChanged(a);
};

type Props = {
    results: SearchResultProps;
    isAwaiting: boolean;
    searchParams: SearchParams;
    setSearchResults: (results: SearchResultProps) => void;
};

export const SearchResults = ({
    results,
    isAwaiting,
    searchParams,
    setSearchResults,
}: Props) => {
    const bem = BEM('search-results');
    const {
        hits,
        prioritized,
        fasett,
        aggregations,
        isMore,
        isSortDate,
    } = results;

    const [chunkCount, setChunkCount] = useState(searchParams.c);
    const [isAwaitingMore, setIsAwaitingMore] = useState(false);
    const router = useRouter();

    const underFacetBuckets = aggregations?.fasetter?.buckets?.find(
        (bucket) => bucket.key === fasett
    )?.underaggregeringer?.buckets;

    const sortFunc = isSortDate ? sortByDate : undefined;

    const allHits = [
        ...filterByFacets(prioritized, underFacetBuckets),
        ...hits,
    ].sort(sortFunc);

    const showMore = async () => {
        setIsAwaitingMore(true);
        const newCount = chunkCount + 1;
        const { result, error } = await fetchSearchResultsClientSide(
            { ...searchParams, c: newCount },
            router
        );
        setChunkCount(newCount);
        setIsAwaitingMore(false);

        if (result) {
            setSearchResults(result);
        }

        if (error) {
            console.error(`failed to fetch more: ${error}`);
        }
    };

    return (
        <div className={bem()}>
            {isAwaiting ? (
                <Spinner text={'Henter søke-resultater...'} />
            ) : (
                <>
                    {allHits?.length > 0 ? (
                        allHits.map((hitProps, index) => (
                            <SearchHit {...hitProps} key={index} />
                        ))
                    ) : (
                        <div className={bem('no-hits')}>
                            <Undertittel>
                                {`Ingen treff${
                                    results.word ? ` for "${results.word}"` : ''
                                }.`}
                            </Undertittel>
                            <Normaltekst>
                                {
                                    'Prøv igjen med mer generelle søkeord, eller andre søkefiltre. '
                                }
                                <LenkeNavNo
                                    href={Config.PATHS.searchTips}
                                    withChevron={false}
                                >
                                    {'Se søketips.'}
                                </LenkeNavNo>
                            </Normaltekst>
                        </div>
                    )}
                    {isMore && (
                        <Flatknapp
                            onClick={showMore}
                            className={bem('show-more')}
                            spinner={isAwaitingMore}
                            disabled={isAwaitingMore}
                        >
                            <Undertittel>
                                {isAwaitingMore
                                    ? 'Henter flere treff...'
                                    : 'Vis flere treff'}
                            </Undertittel>
                        </Flatknapp>
                    )}
                </>
            )}
        </div>
    );
};
