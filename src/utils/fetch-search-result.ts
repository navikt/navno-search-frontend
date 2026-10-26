import { SearchApiResponse } from '../pages/api/search';
import { logger } from '@navikt/next-logger';
import { Config } from 'config';
import { SearchParams, searchParamsDefault } from 'types/search-params';
import { SearchResultProps } from 'types/search-result';
import { fetchWithTimeout, objectToQueryString } from './fetch-utils';

const validFacets: ReadonlySet<string> = new Set([
    'privatperson',
    'arbeidsgiver',
    'samarbeidspartner',
    'presse',
    'statistikk',
    'analyser-og-forskning',
    'innhold-fra-fylker',
]);

export const isValidFacet = (facet: unknown): facet is string =>
    typeof facet === 'string' && validFacets.has(facet);

export const fetchSearchResults = (
    params?: Omit<Partial<SearchParams>, 'f'> & { f?: string | string[] },
    defaultFacetOverride?: string,
    defaultLanguageOverride?: string
): Promise<SearchResultProps> => {
    const defaultFacet = isValidFacet(defaultFacetOverride)
        ? defaultFacetOverride
        : searchParamsDefault.f;

    const facet = isValidFacet(params?.f) ? params.f : defaultFacet;

    if (params?.f !== undefined && !isValidFacet(params.f)) {
        logger.warn('Invalid search facet; using default facet');
    }

    const queryString = objectToQueryString({
        ...searchParamsDefault,
        ...(defaultLanguageOverride && {
            preferredLanguage: defaultLanguageOverride,
        }),
        ...params,
        f: facet,
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
