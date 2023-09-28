import { SearchSort } from './search-params';

export enum DaterangeKey {
    Last7Days = 'Siste 7 dager',
    Last30Days = 'Siste 30 dager',
    Last12Months = 'Siste 12 måneder',
    Over12Months = 'Eldre enn 12 måneder',
    All = 'Alle datoer',
}

export type DaterangeBucketProps = {
    key: DaterangeKey;
    docCount: number;
    checked: boolean;
};

export type DaterangeProps = {
    docCount: number;
    checked: boolean;
    buckets: DaterangeBucketProps[];
};

export type FacetBucketProps = {
    key: string;
    name: string;
    docCount: number;
    checked: boolean;
    underaggregeringer: {
        buckets: FacetBucketProps[];
    };
};

export type Audience = 'person' | 'employer' | 'provider' | 'other';

export type Language = 'no' | 'nn' | 'en';

export type SearchHitProps = {
    displayName: string;
    href: string;
    highlight: string;
    modifiedTime?: string;
    audience?: Audience | Audience[];
    language: Language;
};

export type SearchResultProps = {
    c: number;
    s: SearchSort;
    daterange: number;
    isMore: boolean;
    word: string;
    total: string;
    fasettKey: string;
    aggregations: {
        fasetter: {
            buckets: FacetBucketProps[];
        };
        tidsperiode: DaterangeProps;
    };
    hits: SearchHitProps[];
    isInitialResult?: boolean;
    autoComplete: string
};
