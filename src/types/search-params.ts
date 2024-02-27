import { SearchResultProps } from './search-result';
import Config from '../config';

export enum SearchSort {
    BestMatch = 0,
    Newest = 1,
}

export type SearchParams = {
    // Search string
    ord: string;
    // Facet
    f: string;
    // Under-facets
    uf: string[];
    // Page number
    page: number;

    s: SearchSort;
    audience: string;
    preferredLanguage: string;
};

export const searchParamsDefaultFilters = {
    f: Config.VARS.keys.defaultFacet,
    uf: [],
    s: SearchSort.BestMatch,
    audience: Config.VARS.keys.defaultAudience,
    preferredLanguage: Config.VARS.keys.defaultPreferredLanguage,
};

export const searchParamsDefault: SearchParams = {
    ord: '',
    page: 0,
    ...searchParamsDefaultFilters,
};

export const paramsFromResult = (searchResult: SearchResultProps | null) => {
    if (!searchResult) {
        return searchParamsDefault;
    }

    const initialFacet = searchResult.aggregations?.fasetter?.buckets?.find(
        (bucket) => bucket.key === searchResult.fasettKey
    );

    const initialUfKeys = initialFacet?.underaggregeringer?.buckets?.reduce<
        string[]
    >((acc, bucket) => (bucket.checked ? [...acc, bucket.key] : acc), []);

    return {
        ...searchParamsDefault,
        ...(searchResult.word && { ord: searchResult.word }),
        ...(initialFacet && { f: initialFacet.key }),
        ...(initialUfKeys && initialUfKeys.length > 0 && { uf: initialUfKeys }),
        ...(searchResult.s && { s: Number(searchResult.s) }),
        ...(searchResult.audience && { audience: searchResult.audience }),
        ...(searchResult.preferredLanguage && {
            preferredLanguage: searchResult.preferredLanguage,
        }),
    };
};
