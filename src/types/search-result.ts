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
    to?: string;
    from?: string;
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

export type Audience = 'person' | 'employer' | 'provider';

export type SearchHitProps = {
    priority: boolean;
    displayName: string;
    href: string;
    displayPath: string;
    highlight: string;
    publish?: {
        from?: string;
        first?: string;
    };
    createdTime: string;
    modifiedTime?: string;
    officeInformation?: {
        phone?: string;
        audienceReception?: string;
    };
    audience?: Audience | Audience[];
};

export type SearchResultProps = {
    c: number;
    s: SearchSort;
    daterange: number;
    isMore: boolean;
    word: string;
    total: string;
    fasett: string;
    fasettKey: string;
    aggregations: {
        fasetter: {
            buckets: FacetBucketProps[];
        };
        Tidsperiode: DaterangeProps;
    };
    hits: SearchHitProps[];
    isInitialResult?: boolean;
};
