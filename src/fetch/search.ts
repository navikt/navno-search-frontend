import { SearchApiResponse } from '../pages/api/search';
import { NextRouter } from 'next/router';
import { Config } from '../config';
import { SearchParams } from '../types/search-params';
import { SearchResultProps } from '../types/search-result';
import { fetchWithTimeout, objectToQueryString } from './_utils';

const xpSearchServiceUrl = `${process.env.XP_ORIGIN}${Config.PATHS.xpSearchService}`;

export const fetchSearchResults = (
    params?: SearchParams
): Promise<SearchResultProps> => {
    const url = `${xpSearchServiceUrl}${objectToQueryString(params)}`;
    return fetchWithTimeout(url, 5000).then((res) => {
        if (res.ok) {
            return res.json();
        }
        const error = `Failed to fetch search results: ${res.statusText}`;
        throw Error(error);
    });
};

export const fetchSearchResultsClientSide = async (
    searchParams: SearchParams,
    router: NextRouter
): Promise<SearchApiResponse> => {
    const queryString = objectToQueryString(searchParams);
    const { result, error } = (await fetch(
        `/api/search${queryString}`
    ).then((res) => res.json())) as SearchApiResponse;

    if (result) {
        const newUrl = `${window.location.href.split('?')[0]}${queryString}`;
        router.push(newUrl, undefined, {
            shallow: true,
        });
    }

    return { result, error };
};
