import React, { useEffect, useState } from 'react';
import { SearchHeader } from './header/SearchHeader';
import { BEM } from '../utils/bem';
import { SearchInput } from './input/SearchInput';
import { SearchSorting } from './sorting/SearchSorting';
import { SearchResults } from './results/SearchResults';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { SearchFilters, UFSetterProps } from './filters/SearchFilters';
import { SearchResultProps } from '../types/search-result';
import {
    SearchParams,
    searchParamsDefault,
    SearchSort,
} from '../types/search-params';
import { fetchSearchResultsClientside } from '../utils/fetch-search-result';
import { initAmplitude, logPageview, logSearchQuery } from '../utils/amplitude';
import { objectToQueryString } from '../utils/fetch-utils';
import Spinner from './spinner/Spinner';
import './SearchPage.less';

const paramsFromResult = (searchResult: SearchResultProps) => {
    const initialFacetIndex = searchResult?.aggregations?.fasetter?.buckets?.findIndex(
        (bucket) => bucket.key === searchResult.fasett
    );

    const initialUnderFacets = searchResult?.aggregations?.fasetter?.buckets[
        initialFacetIndex
    ]?.underaggregeringer?.buckets?.reduce(
        (acc, bucket, index) => (bucket.checked ? [...acc, index] : acc),
        []
    );

    return {
        ...(searchResult.word && { ord: searchResult.word }),
        ...(initialFacetIndex && { f: initialFacetIndex }),
        ...(initialUnderFacets.length > 0 && { uf: initialUnderFacets }),
        ...(searchResult.c && { c: Number(searchResult.c) }),
        ...(searchResult.s && { s: Number(searchResult.s) }),
        ...(searchResult.daterange && {
            daterange: Number(searchResult.daterange),
        }),
    };
};

const SearchPage = (props: SearchResultProps) => {
    const bem = BEM('search');
    const router = useRouter();

    const [searchResults, setSearchResults] = useState<SearchResultProps>(
        props
    );
    const [searchParams, setSearchParams] = useState<SearchParams>(
        searchParamsDefault
    );
    const [isAwaitingResults, setIsAwaitingResults] = useState(false);

    const { fasett, word, total, s: sort } = searchResults;

    const setSearchTerm = (term: string) => {
        const newParams = { ...searchParams, ord: term?.trim() };
        setSearchParams(newParams);
    };
    const setDaterange = (daterange: number) => {
        const newParams = { ...searchParams, daterange };
        setSearchParams(newParams);
        fetchAndSetNewResults(newParams);
    };
    const setSort = (s: number) => {
        const newParams = { ...searchParams, s };
        setSearchParams(newParams);
        fetchAndSetNewResults(newParams);
    };
    const setFacet = (f: number) => {
        const newParams = { ...searchParams, f, uf: undefined };
        setSearchParams(newParams);
        fetchAndSetNewResults(newParams);
    };
    const setUnderFacet = ({ uf, toggle }: UFSetterProps) => {
        const oldUf = searchParams.uf || [];
        const newUf = toggle
            ? oldUf.includes(uf)
                ? oldUf
                : [...oldUf, uf]
            : oldUf.filter((item) => item !== uf);
        const newParams = {
            ...searchParams,
            uf: newUf.length > 0 ? newUf : undefined,
        };
        setSearchParams(newParams);
        fetchAndSetNewResults(newParams);
    };

    const fetchAndSetNewResults = debounce(
        async (params: SearchParams = searchParams) => {
            setIsAwaitingResults(true);
            const { result, error } = await fetchSearchResultsClientside(
                params
            );
            setIsAwaitingResults(false);

            if (result) {
                setSearchResults(result);

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

            logSearchQuery(params.ord);
        },
        100
    );

    useEffect(() => {
        const initialParams = paramsFromResult(searchResults);

        setSearchParams({
            ...searchParamsDefault,
            ...initialParams,
        });

        initAmplitude();
        logPageview();
        if (word) {
            logSearchQuery(word);
        }
    }, []);

    return (
        <div className={bem()}>
            <div className={bem('left-col')}>
                <SearchHeader facet={fasett} />
                <SearchInput
                    initialSearchTerm={word}
                    setSearchTerm={setSearchTerm}
                    fetchNewResults={fetchAndSetNewResults}
                />
                <SearchSorting
                    isSortDate={Number(sort) === SearchSort.Newest}
                    setSort={setSort}
                    searchTerm={word}
                    numHits={Number(total)}
                />
                {isAwaitingResults ? (
                    <Spinner text={'Henter søke-resultater...'} />
                ) : (
                    <SearchResults
                        initialResults={searchResults}
                        searchParams={searchParams}
                    />
                )}
            </div>
            <SearchFilters
                results={searchResults}
                setFacet={setFacet}
                setUnderFacet={setUnderFacet}
                setDaterange={setDaterange}
            />
        </div>
    );
};

export default SearchPage;
