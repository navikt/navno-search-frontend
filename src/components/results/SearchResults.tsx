import React, { useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { SearchHit } from './search-hit/SearchHit';
import { BEM } from '../../utils/bem';
import { Knapp } from 'nav-frontend-knapper';
import { useRouter } from 'next/router';
import { SearchResultProps } from '../../types/search-result';
import { SearchParams } from '../../types/search-params';
import { fetchSearchResultsClientSide } from '../../utils/fetch-search-result';
import Spinner from '../spinner/Spinner';
import { Config } from '../../config';
import Lenke from 'nav-frontend-lenker';
import './SearchResults.less';

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
    const { hits, isMore, word } = results;

    const [isAwaitingMore, setIsAwaitingMore] = useState(false);
    const router = useRouter();

    const showMore = async () => {
        setIsAwaitingMore(true);
        const { result, error } = await fetchSearchResultsClientSide(
            { ...searchParams, c: results.c + 1, start: results.c },
            router
        );
        setIsAwaitingMore(false);

        const newResult = {
            ...result,
            hits: [...results.hits, ...result.hits],
        };

        setSearchResults(newResult);

        if (error) {
            console.error(`Error while fetching more results: ${error}`);
        }
    };

    return (
        <div className={bem()}>
            {isAwaiting ? (
                <Spinner text={'Henter søke-resultater...'} />
            ) : (
                <>
                    {hits?.length > 0 ? (
                        hits.map((hitProps, index) => (
                            <SearchHit
                                hit={hitProps}
                                searchTerm={word}
                                key={index}
                            />
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
                                    'Prøv igjen med mer generelle søkeord, eller forsøk andre søkefiltre. '
                                }
                                <Lenke href={Config.PATHS.searchTips}>
                                    {'Se søketips'}
                                </Lenke>
                            </Normaltekst>
                        </div>
                    )}
                    {isMore && (
                        <Knapp
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
                        </Knapp>
                    )}
                </>
            )}
        </div>
    );
};
