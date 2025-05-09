import { SearchApiResponse } from '../pages/api/search';
import { Config } from 'config';
import { SearchParams, searchParamsDefault } from 'types/search-params';
import { SearchResultProps } from 'types/search-result';
import { fetchWithTimeout, objectToQueryString } from './fetch-utils';

export const fetchSearchResults = (
    params?: SearchParams,
    defaultFacetOverride?: string,
    defaultLanguageOverride?: string
): Promise<SearchResultProps> => {
    const queryString = objectToQueryString({
        ...searchParamsDefault,
        ...(defaultFacetOverride && { f: defaultFacetOverride }),
        ...(defaultLanguageOverride && {
            preferredLanguage: defaultLanguageOverride,
        }),
        ...params,
    });
    const url = encodeURI(`${Config.URLS.searchService}${queryString}`);
    return fetchWithTimeout(url, 5000).then((res) => {
        const typedRes = res as Response;
        if (typedRes.ok) {
            return typedRes.json();
        }
        const error = `Failed to fetch search results from "${url}" - Error: ${typedRes.statusText}`;
        throw Error(error);
    });
};

export const fetchSearchResultsClientside = async (
    searchParams: SearchParams
): Promise<SearchApiResponse> => {
    const queryString = objectToQueryString({
        ...searchParamsDefault,
        ...searchParams,
    });
    const { result, error } = (await fetch(
        `${Config.PATHS.searchApi}${queryString}`
    ).then((res) => res.json())) as SearchApiResponse;

    return { result, error };
};
