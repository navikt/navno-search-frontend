import { SearchSort } from './search-params';

export type FacetBucketProps = {
    key: string;
    name: string;
    docCount: number;
    checked: boolean;
    underaggregeringer: {
        buckets: FacetBucketProps[];
    };
};

export type Audience =
    | 'privatperson'
    | 'arbeidsgiver'
    | 'samarbeidspartner'
    | 'andre';

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
    page: number;
    s: SearchSort;
    preferredLanguage: string;
    isMore: boolean;
    word: string;
    total: string;
    fasettKey: string;
    aggregations: {
        fasetter: {
            buckets: FacetBucketProps[];
        };
    };
    hits: SearchHitProps[];
    isInitialResult?: boolean;
};
