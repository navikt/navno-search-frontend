// navno-search-api's response, as it comes over the wire

export type Bucket = {
	key: string;
	name: string;
	docCount: number;
	checked: boolean;
	// null on an underfacet
	underaggregeringer: { buckets: Bucket[] } | null;
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

export type Hit = {
	displayName: string;
	href: string;
	highlight: string;
	modifiedTime?: string | null;
	publishedTime?: string | null;
	audience?: Audience | Audience[] | null;
	// nb, nn, en, se, …
	language: string;
};

export type SearchResult = {
	page: number;
	s: number;
	preferredLanguage: string;
	isMore: boolean;
	word: string;
	total: number;
	fasettKey: string;
	aggregations: { fasetter: { buckets: Bucket[] } };
	hits: Hit[];
};
