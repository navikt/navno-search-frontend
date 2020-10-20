import { DaterangeKey } from './search-result';

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
    uf: string[];

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
    s: 1,
    daterange: -1,
};
