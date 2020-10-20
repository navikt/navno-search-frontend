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
import { fetchSearchResultsClientSide } from '../utils/fetch-search-result';
import { initAmplitude, logPageview, logSearchQuery } from '../utils/amplitude';
import './SearchPage.less';

const SearchPage = (props: SearchResultProps) => {
    const bem = BEM('search');
    const router = useRouter();

    const [searchResults, setSearchResults] = useState<SearchResultProps>(
        props
    );
    const [isAwaiting, setIsAwaiting] = useState(false);
    const [isLoadedClient, setIsLoaded] = useState(false);

    const { fasett, word, total, aggregations, s: sort } = searchResults;

    const initialParams: SearchParams = {
        ord: word || '',
        c: props.c || searchParamsDefault.c,
        s: props.s || searchParamsDefault.s,
        f:
            aggregations.fasetter.buckets.findIndex(
                (bucket) => bucket.key === fasett
            ) || searchParamsDefault.f,
        daterange: props.daterange || searchParamsDefault.daterange,
    };

    const [searchParams, setSearchParams] = useState<SearchParams>(
        initialParams
    );

    const setSearchTerm = (term: string) =>
        setSearchParams((state) => ({ ...state, ord: term?.trim(), c: 1 }));

    const setDaterange = (daterange: number) =>
        setSearchParams((state) => ({ ...state, daterange, c: 1 }));

    const setSort = (s: number) =>
        setSearchParams((state) => ({ ...state, s, c: 1 }));

    const setFacet = (f: number) =>
        setSearchParams((state) => ({ ...state, f, uf: undefined, c: 1 }));

    const setUnderFacet = ({ underFacet, toggle }: UFSetterProps) => {
        setSearchParams((state) => {
            const oldUf = state.uf || [];
            const newUf = toggle
                ? oldUf.includes(underFacet)
                    ? oldUf
                    : [...oldUf, underFacet]
                : oldUf.filter((item) => item !== underFacet);
            return { ...state, uf: newUf.length > 0 ? newUf : undefined, c: 1 };
        });
    };

    const fetchAndSetNewResults = debounce(async () => {
        setIsAwaiting(true);
        logSearchQuery(searchParams.ord);
        const { result, error } = await fetchSearchResultsClientSide(
            searchParams,
            router
        );
        setIsAwaiting(false);

        if (result) {
            setSearchResults(result);
        }

        if (error) {
            console.error(`failed to fetch results: ${error}`);
        }
    }, 100);

    useEffect(() => {
        if (isLoadedClient) {
            fetchAndSetNewResults();
        }
    }, [
        searchParams.daterange,
        searchParams.f,
        searchParams.uf,
        searchParams.s,
    ]);

    useEffect(() => {
        setIsLoaded(true);
        initAmplitude();
        logPageview();
        if (initialParams.ord) {
            logSearchQuery(initialParams.ord);
        }
    }, []);

    return (
        <div className={bem()}>
            <div className={bem('search-col')}>
                <div className={bem('search-top-row')}>
                    <SearchHeader facet={fasett} />
                    <SearchInput
                        prevSearchTerm={word}
                        setSearchTerm={setSearchTerm}
                        fetchNewResults={fetchAndSetNewResults}
                    />
                    <SearchSorting
                        isSortDate={sort === SearchSort.Newest}
                        setSort={setSort}
                        searchTerm={word}
                        numHits={Number(total)}
                    />
                </div>
                <SearchResults
                    initialResults={searchResults}
                    isAwaiting={isAwaiting}
                    searchParams={searchParams}
                />
            </div>
            <SearchFilters
                daterangeProps={aggregations.Tidsperiode}
                facetsProps={aggregations.fasetter.buckets}
                setFacet={setFacet}
                setUnderFacet={setUnderFacet}
                setDaterange={setDaterange}
            />
        </div>
    );
};

export default SearchPage;
