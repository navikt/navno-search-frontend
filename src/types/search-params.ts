import { DaterangeKey, SearchResultProps } from './search-result';
import Config from '../config';

export const daterangeKeyToParam = {
    [DaterangeKey.All]: -1,
    [DaterangeKey.Over12Months]: 0,
    [DaterangeKey.Last12Months]: 1,
    [DaterangeKey.Last30Days]: 2,
    [DaterangeKey.Last7Days]: 3,
};

export const paramToDaterangeKey = [
    [DaterangeKey.Over12Months],
    [DaterangeKey.Last12Months],
    [DaterangeKey.Last30Days],
    [DaterangeKey.Last7Days],
];

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
    // Number of results to retrieve (20 * c)
    c: number;
    // Skips first (20 * start) results
    start: number;

    s: SearchSort;
    daterange: number;
    audience: string[];
};

export const searchParamsDefaultFilters = {
    f: Config.VARS.keys.defaultFacet,
    uf: [],
    s: SearchSort.BestMatch,
    daterange: Config.VARS.keys.defaultDateRange,
    audience:  Config.VARS.keys.defaultAudience,
};

export const searchParamsDefault: SearchParams = {
    ord: '',
    c: 1,
    start: 0,
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
        ...(searchResult.c && { c: Number(searchResult.c) }),
        ...(searchResult.s && { s: Number(searchResult.s) }),
        ...(searchResult.daterange && {
            daterange: Number(searchResult.daterange),
        }),
    };
};
