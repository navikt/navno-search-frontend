import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchSearchResultsClientside } from '../utils/fetch-search-result';
import { logPageview, logSearchQuery } from '../utils/amplitude';
import { objectToQueryString } from '../utils/fetch-utils';
import { useSearchContext } from '../context/ContextProvider';
import { ActionType } from '../context/actions';
import { SearchInput } from './input/SearchInput';
import { SearchSorting } from './sorting/SearchSorting';
import { Spinner } from './spinner/Spinner';
import { SearchResults } from './results/SearchResults';
import { SearchFilters } from './filters/SearchFilters';
import { SearchHeader } from './header/SearchHeader';
import { Heading } from '@navikt/ds-react';

import style from './SearchPage.module.scss';

const SearchPage = () => {
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
            router.replace(newUrl, undefined, {
                shallow: true,
            });
        }

        if (error) {
            console.error(`Error while fetching results: `, error);
        }

        setIsAwaitingResults(false);
        logSearchQuery();
    };

    const { s, f, uf, preferredLanguage } = params;

    useEffect(() => {
        if (enableClientsideFetch.current) {
            fetchAndSetNewResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s, f, uf, preferredLanguage]);

    useEffect(() => {
        enableClientsideFetch.current = true;
        logPageview();
        if (searchTerm) {
            logSearchQuery();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={style.search}>
                <Heading className={style.heading} level="1" size="large">
                    {'Søk på nav.no'}
                </Heading>
                <SearchHeader result={result} />
                <SearchInput
                    initialSearchTerm={searchTerm}
                    fetchNewResults={fetchAndSetNewResults}
                />
                <SearchSorting result={result} />
                {result.aggregations && (
                    <SearchFilters
                        className={"searchFilters"}
                        result={result}
                    />
                )}
                {isAwaitingResults ? (
                    <Spinner text={'Henter søke-resultater...'} />
                ) : (
                    <SearchResults
                        result={result}
                    />
                )}
        </div>
    );
};

export default SearchPage;
