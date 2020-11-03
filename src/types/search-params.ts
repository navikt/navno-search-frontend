import { DaterangeKey, SearchResultProps } from './search-result';

export const daterangeKeyToParam = {
    [DaterangeKey.All]: -1,
    [DaterangeKey.Over12Months]: 0,
    [DaterangeKey.Last12Months]: 1,
    [DaterangeKey.Last30Days]: 2,
    [DaterangeKey.Last7Days]: 3,
};

export enum SearchSort {
    BestMatch = 0,
    Newest = 1,
}

export type SearchParams = Partial<{
    // Search string
    ord: string;

    // Facet
    f: number;

    // Under-facets
    uf: number[];

    // Number of results to retrieve (20 * c)
    c: number;

    // Skip first (20 * start) results
    start: number;

    s: SearchSort;
    daterange: number;
}>;

export const searchParamsDefault: SearchParams = {
    f: 0,
    c: 1,
    s: 0,
    daterange: -1,
};

export const paramsFromResult = (searchResult: SearchResultProps) => {
    if (!searchResult) {
        return searchParamsDefault;
    }

    const initialFacetIndex = searchResult.aggregations?.fasetter?.buckets?.findIndex(
        (bucket) => bucket.key === searchResult.fasett
    );

    const initialUnderFacets = searchResult.aggregations?.fasetter?.buckets[
        initialFacetIndex
    ]?.underaggregeringer?.buckets?.reduce(
        (acc, bucket, index) => (bucket.checked ? [...acc, index] : acc),
        []
    );

    return {
        ...searchParamsDefault,
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
