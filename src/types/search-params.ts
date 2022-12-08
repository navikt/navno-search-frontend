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
    f: string;

    // Under-facets
    uf: string[];

    // Number of results to retrieve (20 * c)
    c: number;

    // Skip first (20 * start) results
    start: number;

    s: SearchSort;
    daterange: number;
}>;

export const searchParamsDefault: SearchParams = {
    f: '0',
    c: 1,
    s: 0,
    daterange: -1,
};

export const paramsFromResult = (searchResult: SearchResultProps) => {
    if (!searchResult) {
        return searchParamsDefault;
    }

    const initialFacet = searchResult.aggregations?.fasetter?.buckets?.find(
        (bucket) => bucket.key === searchResult.fasettKey
    );

    const initialUfKeys = initialFacet?.underaggregeringer?.buckets?.reduce(
        (acc, bucket) => (bucket.checked ? [...acc, bucket.key] : acc),
        []
    );

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
