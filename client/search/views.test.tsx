import { describe, expect, test } from 'vitest';
import { FACETS, hit, searchResult } from '#test/fixtures.ts';
import { render, text } from '#test/render.ts';
import { Audience } from './Audience.tsx';
import { Hit } from './Hit.tsx';
import { DEFAULTS, MAX_PAGE, type SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';
import { SearchPage, Unavailable } from './SearchPage.tsx';
import { Timestamps } from './Timestamps.tsx';

type Page = {
	result?: SearchResult;
	params?: Partial<SearchParams>;
	landing?: boolean;
};

// What the server sends, before the app hydrates
const page = ({ result = searchResult(), params, landing = false }: Page = {}) =>
	render(<SearchPage initial={{ result, params: { ...DEFAULTS, ...params }, landing }} />);

const inputs = (doc: Document, selector = 'input') => [...doc.querySelectorAll<HTMLInputElement>(selector)];
const checked = (doc: Document, name: string) =>
	inputs(doc, `input[name="${name}"]`)
		.filter((input) => input.checked)
		.map((input) => input.value);

describe('SearchPage', () => {
	test('is one GET form for /sok that the browser does not fill in', () => {
		const form = page().querySelector('form');

		expect(form?.getAttribute('method')).toBe('get');
		expect(form?.getAttribute('action')).toBe('/sok');
		expect(form?.getAttribute('autocomplete')).toBe('off');
	});

	test('names its controls as the URL does, with stable ids', () => {
		const doc = page({ params: { f: 'arbeidsgiver' } });

		expect(inputs(doc).map((input) => [input.name, input.id])).toEqual([
			['ord', 'search-input'],
			['s', 'sok-s-0'],
			['s', 'sok-s-1'],
			['f', 'sok-f-privatperson'],
			['f', 'sok-f-arbeidsgiver'],
			['uf', 'sok-uf-informasjon'],
			['f', 'sok-f-samarbeidspartner'],
			['f', 'sok-f-presse'],
			['preferredLanguage', 'sok-lang-nb'],
			['preferredLanguage', 'sok-lang-nn'],
			['preferredLanguage', 'sok-lang-en'],
		]);
	});

	test('shows the search, checks the chosen facet, underfacets, sorting and language', () => {
		const doc = page({ params: { ord: 'a&b', uf: ['soknad-og-skjema'], s: '1', preferredLanguage: 'en' } });

		expect(doc.querySelector<HTMLInputElement>('input[name="ord"]')?.value).toBe('a&b');
		expect(checked(doc, 'f')).toEqual(['privatperson']);
		expect(checked(doc, 'uf')).toEqual(['soknad-og-skjema']);
		expect(checked(doc, 's')).toEqual(['1']);
		expect(checked(doc, 'preferredLanguage')).toEqual(['en']);
	});

	test('labels the search field, sorting and language, and links to the search tips', () => {
		const doc = page();
		const labels = (name: string) => inputs(doc, `input[name="${name}"]`).map((input) => text(input.labels?.[0]));
		const tips = [...doc.querySelectorAll('a')].filter((a) => text(a) === 'Søketips');

		expect(labels('ord')).toEqual(['Søk på siden']);
		expect(labels('s')).toEqual(['Beste treff', 'Dato']);
		expect(labels('preferredLanguage')).toEqual(['Bokmål', 'Nynorsk', 'English']);
		expect(tips.map((a) => a.getAttribute('href'))).toEqual(['/soketips']);
	});

	test('cuts a long search term to the field length', () => {
		const doc = page({ params: { ord: 'x'.repeat(150) } });

		expect(doc.querySelector<HTMLInputElement>('input[name="ord"]')?.value).toHaveLength(100);
	});

	test('shows each facet with its count, and the chosen one with its underfacets', () => {
		const doc = page();
		const shown = [...doc.querySelectorAll('.sok-facet')].map((facet) => ({
			name: text(facet.querySelector('.sok-facet-option label')),
			count: text(facet.querySelector('.sok-facet-option .sok-count')),
			underfacets: [...facet.querySelectorAll('.sok-underfacet')].map(text),
		}));

		expect(shown).toEqual([
			{ name: 'Privatperson', count: '84', underfacets: ['Informasjon71', 'Søknad og skjema10'] },
			{ name: 'Arbeidsgiver', count: '8', underfacets: [] },
			{ name: 'Samarbeidspartner', count: '9', underfacets: [] },
			{ name: 'Presse', count: '4', underfacets: [] },
		]);
		expect(text(doc.querySelector('.sok-filter-toggle'))).toBe(`Søkefilter: ${FACETS[0].name}`);
	});

	test('starts with the filter panel closed on a phone', () => {
		const doc = page();

		expect(doc.querySelector('.sok-filter-toggle')?.getAttribute('aria-expanded')).toBe('false');
		expect(doc.querySelector('#sok-filter-panel')?.classList.contains('sok-filter-panel--open')).toBe(false);
	});

	test('sums up the hits, numbered for "Vis flere treff" to land on', () => {
		const doc = page();

		expect(text(doc.querySelector('.sok-summary h2'))).toBe('84 treff for «dagpenger» med valgte søkefilter.');
		expect([...doc.querySelectorAll('a[id^="sok-treff-"]')].map((a) => [a.id, a.getAttribute('href')])).toEqual([
			['sok-treff-1', 'https://www.nav.no/dagpenger'],
			['sok-treff-2', 'https://www.nav.no/send-meldekort-dagpenger'],
		]);
	});

	test('sums up a search without a term', () => {
		const doc = page({ result: searchResult({ word: '', total: 850 }) });

		expect(text(doc.querySelector('.sok-summary h2'))).toBe('850 treff med valgte søkefilter.');
	});

	// Without an underfacet the chosen facet doesn't show, which would filter the hits unseen
	test('links "Vis flere treff" to the next page, at its first hit', () => {
		const doc = page({ params: { ord: 'a&b', f: 'arbeidsgiver', uf: ['informasjon', 'kontor'], page: 1 } });
		const link = doc.querySelector('a.sok-show-more');
		const url = new URL(link?.getAttribute('href') ?? '', 'http://localhost');

		expect(text(link)).toBe('Vis flere treff');
		expect(link?.getAttribute('role')).toBeNull();
		expect(url.pathname).toBe('/sok');
		expect(url.hash).toBe('#sok-treff-3');
		expect([...url.searchParams]).toEqual([
			['ord', 'a&b'],
			['f', 'arbeidsgiver'],
			['s', '0'],
			['preferredLanguage', 'nb'],
			['page', '2'],
			['uf', 'informasjon'],
		]);
	});

	test.each([
		['on the last page', { result: searchResult({ isMore: false }) }],
		[`at page ${MAX_PAGE}`, { params: { page: MAX_PAGE } }],
	])('has no "Vis flere treff" %s', (_, props) => {
		expect(page(props).querySelector('.sok-show-more')).toBeNull();
	});

	test('shows no hits before a search is made', () => {
		const doc = page({ landing: true });

		expect(doc.querySelector('h1')?.textContent).toBe('Søk på nav.no');
		expect(doc.querySelector('.sok-summary')).toBeNull();
		expect(doc.querySelector('a[id^="sok-treff-"]')).toBeNull();
		expect(doc.querySelector('.sok-show-more')).toBeNull();
		expect(checked(doc, 'f')).toEqual(['privatperson']);
	});

	test('says so when the search service is down', () => {
		expect(text(render(<Unavailable />).querySelector('[role="alert"]'))).toBe(
			'Feil - søketjenesten er ikke tilgjengelig'
		);
	});
});

describe('Hit', () => {
	test('links its title to the page', () => {
		const link = render(<Hit hit={hit()} number={1} />).querySelector('a#sok-treff-1');

		expect([link?.getAttribute('href'), text(link)]).toEqual(['https://www.nav.no/dagpenger', 'Dagpenger']);
	});

	test("closes a <b> the API's cut left open, so the rest of the page isn't bold", () => {
		const doc = render(<Hit hit={hit({ highlight: 'Du kan søke om <b>dagpeng' })} number={1} />);

		expect(text(doc.querySelector('.sok-hit-highlight b'))).toBe('dagpeng');
		expect(doc.querySelector('.sok-hit-footer')?.closest('b')).toBeNull();
	});

	test('leaves out a hit without a title or a link', () => {
		expect(render(<Hit hit={hit({ href: '' })} number={1} />).body.innerHTML).toBe('');
		expect(render(<Hit hit={hit({ displayName: '' })} number={1} />).body.innerHTML).toBe('');
	});
});

describe('Timestamps', () => {
	const dates = { publishedTime: '2021-12-31T00:00:00Z', modifiedTime: '2022-01-01T00:00:00Z' };
	const shown = (overrides: Parameters<typeof hit>[0]) =>
		text(render(<Timestamps hit={hit({ ...dates, ...overrides })} />).body);

	test.each([
		['published and modified, in Norwegian', { language: 'no' }, 'Publisert 31.12.2021 | Oppdatert 01.01.2022'],
		['published and modified, in English', { language: 'en' }, 'Published 31.12.2021 | Updated 01.01.2022'],
		['published only', { modifiedTime: null }, 'Publisert 31.12.2021'],
		['modified before it was published', { modifiedTime: '2021-12-30T00:00:00Z' }, 'Publisert 31.12.2021'],
		['nothing without a published date', { publishedTime: null }, ''],
		// Not the server's time zone, which is UTC in the pod
		['dates as in Norway', { publishedTime: '2021-12-31T23:30:00Z', modifiedTime: null }, 'Publisert 01.01.2022'],
	])('%s', (_, overrides, expected) => {
		expect(shown(overrides)).toBe(expected);
	});
});

describe('Audience', () => {
	const tags = (...props: Parameters<typeof Audience>) =>
		[...render(<>{Audience(...props)}</>).querySelectorAll('.aksel-tag')].map(text);

	test.each([
		[['person'], 'nb', ['Privatperson']],
		[['employer'], 'en', ['Employer']],
		[['provider', 'provider_doctor'], 'nn', ['Samarbeidspartnar', 'Lege, tannlege eller annan behandlar']],
		['other', 'se', ['Annet']],
	] as const)('%j in %s', (audience, language, expected) => {
		expect(tags({ audience: audience as never, language })).toEqual(expected);
	});

	test('leaves out an audience it does not know', () => {
		expect(tags({ audience: ['person', 'ukjent'] as never, language: 'nb' })).toEqual(['Privatperson']);
	});
});
