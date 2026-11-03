import type { Bucket, Hit, SearchResult } from '#shared/types.ts';

// navno-search-api's response, in its wire shape, cut down to what the tests need

export const hit = (overrides: Partial<Hit> = {}): Hit => ({
	displayName: 'Dagpenger',
	href: 'https://www.nav.no/dagpenger',
	highlight: '<b>Dagpenger</b> er en pengestøtte du kan få når du er arbeidsledig eller permittert.',
	modifiedTime: null,
	publishedTime: null,
	audience: ['person'],
	language: 'nb',
	...overrides,
});

const underfacet = (key: string, name: string, docCount: number): Bucket => ({
	key,
	name,
	docCount,
	checked: false,
	underaggregeringer: null,
});

const facet = (key: string, name: string, docCount: number, underfacets: Bucket[] = []): Bucket => ({
	key,
	name,
	docCount,
	checked: false,
	underaggregeringer: { buckets: underfacets },
});

export const FACETS: Bucket[] = [
	facet('privatperson', 'Privatperson', 84, [
		underfacet('informasjon', 'Informasjon', 71),
		underfacet('soknad-og-skjema', 'Søknad og skjema', 10),
	]),
	facet('arbeidsgiver', 'Arbeidsgiver', 8, [underfacet('informasjon', 'Informasjon', 6)]),
	facet('samarbeidspartner', 'Samarbeidspartner', 9),
	facet('presse', 'Presse', 4),
];

export const searchResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
	page: 0,
	s: 0,
	preferredLanguage: 'nb',
	isMore: true,
	word: 'dagpenger',
	total: 84,
	fasettKey: 'privatperson',
	aggregations: { fasetter: { buckets: FACETS } },
	hits: [
		hit(),
		hit({
			displayName: 'Fyll ut meldekort – dagpenger',
			href: 'https://www.nav.no/send-meldekort-dagpenger',
			highlight: 'Du må sende meldekort mens du mottar <b>dagpenger</b>.',
		}),
	],
	...overrides,
});
