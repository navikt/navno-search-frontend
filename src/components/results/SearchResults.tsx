import React, { useEffect, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { SearchHit } from './search-hit/SearchHit';
import { BEM } from '../../utils/bem';
import { Knapp } from 'nav-frontend-knapper';
import { SearchResultProps } from '../../types/search-result';
import { SearchParams } from '../../types/search-params';
import { fetchSearchResultsClientSide } from '../../utils/fetch-search-result';
import Spinner from '../spinner/Spinner';
import { Config } from '../../config';
import Lenke from 'nav-frontend-lenker';
import './SearchResults.less';

type Props = {
    initialResults: SearchResultProps;
    isAwaiting: boolean;
    searchParams: SearchParams;
};

export const SearchResults = ({
    initialResults,
    isAwaiting,
    searchParams,
}: Props) => {
    const bem = BEM('search-results');

    const [results, setResults] = useState(initialResults);
    const [isAwaitingMore, setIsAwaitingMore] = useState(false);

    const showMore = async () => {
        setIsAwaitingMore(true);
        const { result, error } = await fetchSearchResultsClientSide({
            ...searchParams,
            c: results.c + 1,
            start: results.c,
        });
        setIsAwaitingMore(false);

        setResults({
            ...result,
            hits: [...results.hits, ...result.hits],
        });

        if (error) {
            console.error(`Error while fetching more results: ${error}`);
        }
    };

    useEffect(() => {
        setResults(initialResults);
    }, [initialResults]);

    return (
        <div className={bem()}>
            {isAwaiting ? (
                <Spinner text={'Henter søke-resultater...'} />
            ) : (
                <>
                    {results.hits?.length > 0 ? (
                        results.hits.map((hitProps, index) => (
                            <SearchHit
                                hit={hitProps}
                                searchTerm={initialResults.word}
                                key={index}
                            />
                        ))
                    ) : (
                        <div className={bem('no-hits')}>
                            <Undertittel>
                                {`Ingen treff${
                                    initialResults.word
                                        ? ` for "${initialResults.word}"`
                                        : ''
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
                    {results.isMore && (
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
