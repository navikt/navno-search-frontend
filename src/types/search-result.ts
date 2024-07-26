import { SearchSort } from './search-params';

export type FacetBucketProps = {
    key: string;
    name: string;
    docCount: number;
    checked: boolean;
    default?: boolean;
    underaggregeringer: {
        buckets: FacetBucketProps[];
    };
};

export type Audience =
    | 'person'
    | 'employer'
    | 'provider'
    | 'provider_doctor'
    | 'provider_municipality_employed'
    | 'provider_optician'
    | 'provider_administrator'
    | 'provider_measures_organizer'
    | 'provider_aid_supplier'
    | 'provider_other'
    | 'other';

export type Language = 'no' | 'nn' | 'en';

export type SearchHitProps = {
    displayName: string;
    href: string;
    highlight: string;
    modifiedTime?: string;
    publishedTime?: string;
    audience?: Audience | Audience[];
    language: Language;
};

export type SearchResultProps = {
    page: number;
    s: SearchSort;
    preferredLanguage: string;
    isMore: boolean;
    word: string;
    total: number;
    fasettKey: string;
    aggregations: {
        fasetter: {
            buckets: FacetBucketProps[];
        };
    };
    hits: SearchHitProps[];
    isInitialResult?: boolean;
};
