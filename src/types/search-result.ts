import { SearchSort } from './search-params';

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export enum DaterangeKey {
    Last7Days = 'Siste 7 dager',
    Last30Days = 'Siste 30 dager',
    Last12Months = 'Siste 12 måneder',
    Over12Months = 'Eldre enn 12 måneder',
    All = 'Alle datoer',
}

export type DaterangeBucketProps = DeepPartial<{
    key: DaterangeKey;
    docCount: number;
    checked: boolean;
    to?: string;
    from?: string;
}>;

export type DaterangeProps = DeepPartial<{
    docCount: number;
    checked: boolean;
    buckets: DaterangeBucketProps[];
}>;

export type FacetBucketProps = DeepPartial<{
    key: string;
    docCount: number;
    checked: boolean;
    underaggregeringer: {
        buckets: FacetBucketProps[];
    };
    default?: boolean;
}>;

export type SearchHitProps = DeepPartial<{
    priority: boolean;
    displayName: string;
    href: string;
    displayPath: string;
    highlight: string;
    publish: {
        from: string;
        first: string;
    };
    createdTime: string;
    modifiedTime: string;
    id: string;
    score: number;
    keywords: string[];
    officeInformation: {
        phone: string;
        audienceReception: string;
    };
}>;

export type SearchResultProps = DeepPartial<{
    c: number;
    isSortDate: boolean; // note: this value is inverted!
    s: SearchSort;
    daterange: number;
    isMore: boolean;
    word: string;
    total: string;
    fasett: string;
    aggregations: {
        fasetter: {
            buckets: FacetBucketProps[];
        };
        Tidsperiode: DaterangeProps;
    };
    hits: SearchHitProps[];
    prioritized: SearchHitProps[];
}>;
