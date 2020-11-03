import React, { useEffect, useRef, useState } from 'react';
import { SearchHeader } from './header/SearchHeader';
import { BEM } from '../utils/bem';
import { useRouter } from 'next/router';
import { fetchSearchResultsClientside } from '../utils/fetch-search-result';
import { initAmplitude, logPageview, logSearchQuery } from '../utils/amplitude';
import { objectToQueryString } from '../utils/fetch-utils';
import { useSearchContext } from '../context/ContextProvider';
import { ActionType } from '../context/actions';
import { SearchInput } from './input/SearchInput';
import { SearchSorting } from './sorting/SearchSorting';
import { SearchSort } from '../types/search-params';
import Spinner from './spinner/Spinner';
import { SearchResults } from './results/SearchResults';
import { SearchFilters } from './filters/SearchFilters';
import './SearchPage.less';

const SearchPage = () => {
    const bem = BEM('search');
    const [{ result, params }, dispatch] = useSearchContext();
    const { word: searchTerm } = result;

    const enableClientsideFetch = useRef(false);
    const [isAwaitingResults, setIsAwaitingResults] = useState(false);

    const router = useRouter();

    const fetchAndSetNewResults = async () => {
        setIsAwaitingResults(true);

        const { result, error } = await fetchSearchResultsClientside(params);

        if (result) {
            dispatch({ type: ActionType.SetResults, result: result });

            // Sets the correct query string in the browser url-bar
            const newUrl = `${
                window.location.href.split('?')[0]
            }${objectToQueryString(params)}`;
            router.push(newUrl, undefined, {
                shallow: true,
            });
        }

        if (error) {
            console.error(`Error while fetching results: ${error}`);
        }

        setIsAwaitingResults(false);

        logSearchQuery(params.ord);
    };

    const { s, daterange, f, uf } = params;
    useEffect(() => {
        if (enableClientsideFetch.current) {
            fetchAndSetNewResults();
        }
    }, [s, daterange, f, uf]);

    useEffect(() => {
        enableClientsideFetch.current = true;
        initAmplitude();
        logPageview();
        if (searchTerm) {
            logSearchQuery(searchTerm);
        }
    }, []);

    return (
        <div className={bem()}>
            <div className={bem('left-col')}>
                <SearchHeader result={result} />
                <SearchInput
                    initialSearchTerm={searchTerm}
                    fetchNewResults={fetchAndSetNewResults}
                />
                <SearchSorting
                    isSortDate={Number(result.s) === SearchSort.Newest}
                    searchTerm={searchTerm}
                    numHits={Number(result.total)}
                />
                {isAwaitingResults ? (
                    <Spinner text={'Henter søke-resultater...'} />
                ) : (
                    <SearchResults result={result} />
                )}
            </div>
            {result.aggregations && <SearchFilters result={result} />}
        </div>
    );
};

export default SearchPage;
