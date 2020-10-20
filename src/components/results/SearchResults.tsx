import React, { useEffect, useState } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { SearchHit } from './search-hit/SearchHit';
import { BEM } from '../../utils/bem';
import { Knapp } from 'nav-frontend-knapper';
import { SearchResultProps } from '../../types/search-result';
import { SearchParams } from '../../types/search-params';
import { fetchSearchResultsClientside } from '../../utils/fetch-search-result';
import { NoHits } from './no-hits/NoHits';
import './SearchResults.less';

type Props = {
    initialResults: SearchResultProps;
    searchParams: SearchParams;
};

export const SearchResults = ({ initialResults, searchParams }: Props) => {
    const bem = BEM('search-results');

    const [results, setResults] = useState(initialResults);
    const [isAwaitingMore, setIsAwaitingMore] = useState(false);

    const showMore = async () => {
        setIsAwaitingMore(true);
        const { result, error } = await fetchSearchResultsClientside({
            ...searchParams,
            c: results.c + 1,
            start: results.c,
        });
        setIsAwaitingMore(false);

        if (result) {
            setResults({
                ...result,
                hits: [...results?.hits, ...result.hits],
            });
        }

        if (error) {
            console.error(`Error while fetching more results: ${error}`);
        }
    };

    useEffect(() => {
        setResults(initialResults);
    }, [initialResults]);

    return (
        <div className={bem()}>
            {results.hits?.length > 0 ? (
                results.hits.map((hitProps, index) => (
                    <SearchHit
                        hit={hitProps}
                        searchTerm={results.word}
                        key={index}
                    />
                ))
            ) : (
                <NoHits searchTerm={results.word} />
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
        </div>
    );
};
