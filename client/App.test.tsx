import type { MockReply } from '@itsy/corgi/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { DEFAULTS, type SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';
import { installMockFetch } from '#test/fetch.ts';
import { hit, searchResult } from '#test/fixtures.ts';
import { setAnalytics } from './analytics.ts';
import { App, type AppProps } from './App.tsx';

// navno-search-api through /sok/api/search: a test sets the reply, or holds it back
const http = installMockFetch();
const reply = (answer: MockReply | MockReply[]) => http.get('/sok/api/search', answer);
const asked = () => http.calls.map((call) => call.url);

const log = vi.fn(() => Promise.resolve());
const logged = () => log.mock.calls as unknown[][];

const deferred = <T,>() => {
	let resolve: (value: T) => void = () => undefined;
	const promise = new Promise<T>((r) => (resolve = r));
	return { promise, resolve };
};

const PROPS: AppProps = {
	result: searchResult(),
	params: { ...DEFAULTS, ord: 'dagpenger' },
	landing: false,
};

beforeEach(() => {
	reply(({ query }) => ({ json: searchResult({ word: query.get('ord') ?? '', fasettKey: query.get('f') ?? '' }) }));
	setAnalytics(log as unknown as Parameters<typeof setAnalytics>[0]);
	window.history.replaceState(null, '', '/sok?ord=dagpenger');
	// jsdom can't follow links
	document.addEventListener('click', preventNavigation);
});

afterEach(() => {
	log.mockClear();
	document.removeEventListener('click', preventNavigation);
});

const preventNavigation = (e: Event) => {
	if ((e.target as Element).closest('a')) {
		e.preventDefault();
	}
};

const open = (props: Partial<AppProps> = {}) => {
	render(<App {...PROPS} {...props} />);
	return userEvent.setup();
};

const spinner = () => screen.queryByRole('status');
const hitLinks = () => screen.queryAllByRole('link').filter((link) => link.id.startsWith('sok-treff-'));
const summary = () => screen.queryByRole('heading', { level: 2 })?.textContent;

describe('a change to a filter', () => {
	test('of facet searches in place, with a spinner meanwhile, and the URL follows', async () => {
		const user = open();
		const pending = deferred<SearchResult>();
		reply(async () => ({ json: await pending.promise }));

		await user.click(screen.getByRole('radio', { name: 'Arbeidsgiver' }));

		// The old facet's underfacets don't come along
		expect(asked()).toEqual(['/sok/api/search?ord=dagpenger&f=arbeidsgiver&s=0&preferredLanguage=nb&page=0']);
		expect(spinner()?.textContent).toContain('Henter søkeresultater...');
		expect(hitLinks()).toEqual([]);

		await act(async () => pending.resolve(searchResult({ fasettKey: 'arbeidsgiver', total: 8 })));

		expect(spinner()).toBeNull();
		expect(summary()).toBe('8 treff for «dagpenger» med valgte søkefilter.');
		expect(screen.getByRole('radio', { name: 'Arbeidsgiver' })).toHaveProperty('checked', true);
		expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Arbeidsgiver' }));
		expect(`${location.pathname}${location.search}`).toBe(
			'/sok?ord=dagpenger&f=arbeidsgiver&s=0&preferredLanguage=nb&page=0'
		);
		expect(logged()).toEqual([
			['filtervalg', { filternavn: 'arbeidsgiver', subFilter: undefined }],
			['søk', { sokeord: '[redacted]', komponentId: 'søkeside' }],
		]);
	});

	test('of underfacet searches with it, and logs it with its facet when checked', async () => {
		const user = open();

		await user.click(screen.getByRole('checkbox', { name: 'Informasjon' }));
		await waitFor(() => expect(spinner()).toBeNull());
		await user.click(screen.getByRole('checkbox', { name: 'Informasjon' }));
		await waitFor(() => expect(asked()).toHaveLength(2));

		expect(asked()).toEqual([
			'/sok/api/search?ord=dagpenger&f=privatperson&uf=informasjon&s=0&preferredLanguage=nb&page=0',
			'/sok/api/search?ord=dagpenger&f=privatperson&s=0&preferredLanguage=nb&page=0',
		]);
		expect(logged().filter(([name]) => name === 'filtervalg')).toEqual([
			['filtervalg', { filternavn: 'privatperson', subFilter: 'informasjon' }],
		]);
	});

	test('of language is logged; of sorting, not', async () => {
		const user = open();

		await user.click(screen.getByRole('radio', { name: 'English' }));
		await waitFor(() => expect(spinner()).toBeNull());
		await user.click(screen.getByRole('radio', { name: 'Dato' }));
		await waitFor(() => expect(asked()).toHaveLength(2));

		expect(asked()[0]).toContain('preferredLanguage=en');
		expect(asked()[1]).toContain('s=1');
		expect(logged().filter(([name]) => name === 'filtervalg')).toEqual([
			['filtervalg', { filternavn: 'en', subFilter: undefined }],
		]);
	});

	test('searches for what is typed in the field, as a submitted form would', async () => {
		const user = open();

		await user.clear(screen.getByRole('searchbox'));
		await user.type(screen.getByRole('searchbox'), 'sykepenger');
		await user.click(screen.getByRole('radio', { name: 'Presse' }));

		expect(asked()).toEqual(['/sok/api/search?ord=sykepenger&f=presse&s=0&preferredLanguage=nb&page=0']);
	});

	test('only shows the answer to the latest one', async () => {
		const user = open();
		const first = deferred<SearchResult>();
		reply([async () => ({ json: await first.promise }), { json: searchResult({ total: 9 }) }]);

		await user.click(screen.getByRole('radio', { name: 'Arbeidsgiver' }));
		await user.click(screen.getByRole('radio', { name: 'Samarbeidspartner' }));
		await waitFor(() => expect(summary()).toBe('9 treff for «dagpenger» med valgte søkefilter.'));
		await act(async () => first.resolve(searchResult({ total: 8 })));

		expect(summary()).toBe('9 treff for «dagpenger» med valgte søkefilter.');
	});

	test('only shows the answer to the latest one, even if the one before has started to arrive', async () => {
		const user = open();
		const body = deferred<void>();
		const held = new ReadableStream({
			start: async (controller) => {
				await body.promise;
				controller.enqueue(new TextEncoder().encode(JSON.stringify(searchResult({ total: 8 }))));
				controller.close();
			},
		});
		// The first one's headers at once, its body when told
		reply([
			{ status: 200, headers: { 'content-type': 'application/json' }, body: held },
			{ json: searchResult({ total: 9 }) },
		]);

		await user.click(screen.getByRole('radio', { name: 'Arbeidsgiver' }));
		await user.click(screen.getByRole('radio', { name: 'Samarbeidspartner' }));
		await waitFor(() => expect(summary()).toBe('9 treff for «dagpenger» med valgte søkefilter.'));
		await act(async () => body.resolve());

		expect(summary()).toBe('9 treff for «dagpenger» med valgte søkefilter.');
	});

	test('that fails says so, rather than spinning, and the next one recovers', async () => {
		const user = open();
		reply({ status: 502 });

		await user.click(screen.getByRole('radio', { name: 'Arbeidsgiver' }));

		expect((await screen.findByRole('alert')).textContent).toBe('Feil - søketjenesten er ikke tilgjengelig');
		expect(spinner()).toBeNull();

		reply({ json: searchResult({ total: 9 }) });
		await user.click(screen.getByRole('radio', { name: 'Presse' }));

		await waitFor(() => expect(summary()).toBe('9 treff for «dagpenger» med valgte søkefilter.'));
		expect(screen.queryByRole('alert')).toBeNull();
	});
});

describe('the search field', () => {
	test('searches on Enter, closes the keyboard and logs the search', async () => {
		const user = open({ landing: true, params: DEFAULTS });

		await user.type(screen.getByRole('searchbox'), 'sykepenger{Enter}');
		await waitFor(() => expect(summary()).toBe('84 treff for «sykepenger» med valgte søkefilter.'));

		expect(asked()).toEqual(['/sok/api/search?ord=sykepenger&f=privatperson&s=0&preferredLanguage=nb&page=0']);
		expect(document.activeElement).toBe(document.body);
		expect(logged()).toEqual([['søk', { sokeord: '[redacted]', komponentId: 'søkeside' }]]);
	});

	test('has a button that clears it', async () => {
		const user = open();

		await user.click(screen.getByRole('button', { name: 'Tøm feltet' }));

		expect(screen.getByRole('searchbox')).toHaveProperty('value', '');
		expect(asked()).toEqual([]);
	});
});

describe('"Vis flere treff"', () => {
	test('adds the next page, goes on from its first hit, and logs it', async () => {
		const user = open();
		const pending = deferred<SearchResult>();
		reply(async () => ({ json: await pending.promise }));

		await user.click(screen.getByRole('link', { name: 'Vis flere treff' }));

		expect(asked()).toEqual(['/sok/api/search?ord=dagpenger&f=privatperson&s=0&preferredLanguage=nb&page=1']);
		// The hits stay while the button loads
		expect(hitLinks()).toHaveLength(2);
		expect(document.querySelector('.sok-show-more')?.classList.contains('aksel-button--loading')).toBe(true);

		await act(async () =>
			pending.resolve(searchResult({ page: 1, hits: [hit({ displayName: 'Treff 3', href: 'https://www.nav.no/3' })] }))
		);

		expect(hitLinks().map((link) => [link.id, link.textContent])).toEqual([
			['sok-treff-1', 'Dagpenger'],
			['sok-treff-2', 'Fyll ut meldekort – dagpenger'],
			['sok-treff-3', 'Treff 3'],
		]);
		expect(document.activeElement?.id).toBe('sok-treff-3');
		expect(location.search).toContain('page=1');
		expect(logged()).toEqual([['vis-flere-treff', { page: 1 }]]);
	});

	test('in a new tab is the link’s', async () => {
		const user = open();

		await user.keyboard('{Control>}');
		await user.click(screen.getByRole('link', { name: 'Vis flere treff' }));
		await user.keyboard('{/Control}');

		expect(asked()).toEqual([]);
	});
});

describe('on a phone', () => {
	test('the filter toggle opens and closes the panel', async () => {
		const user = open();
		const toggle = screen.getByRole('button', { name: /Søkefilter: Privatperson/ });

		await user.click(toggle);

		expect(toggle.getAttribute('aria-expanded')).toBe('true');
		expect(document.querySelector('#sok-filter-panel')?.classList.contains('sok-filter-panel--open')).toBe(true);

		await user.click(toggle);

		expect(toggle.getAttribute('aria-expanded')).toBe('false');
	});
});

describe('a hit', () => {
	test('is logged when its link is clicked', async () => {
		const user = open();

		await user.click(screen.getByRole('link', { name: 'Fyll ut meldekort – dagpenger' }));

		expect(logged()).toEqual([
			['resultat-klikk', { destinasjon: 'Fyll ut meldekort – dagpenger', sokeord: '[redacted]', treffnr: 2 }],
		]);
	});
});

describe('the server-rendered page', () => {
	test.each<[string, Partial<AppProps>]>([
		['with hits', {}],
		['before a search', { landing: true, params: DEFAULTS }],
		['when the search service is down', { result: null }],
	])('hydrates without a mismatch, %s', async (_, props) => {
		const all = { ...PROPS, ...props };
		const container = document.createElement('main');
		container.innerHTML = renderToString(<App {...all} />);
		document.body.append(container);
		const onRecoverableError = vi.fn();
		const consoleError = vi.spyOn(console, 'error');

		const root = await act(async () => hydrateRoot(container, <App {...all} />, { onRecoverableError }));

		expect(onRecoverableError).not.toHaveBeenCalled();
		expect(consoleError).not.toHaveBeenCalled();
		act(() => root.unmount());
		container.remove();
		consoleError.mockRestore();
	});

	test('searches once hydrated', async () => {
		const container = document.createElement('main');
		container.innerHTML = renderToString(<App {...PROPS} />);
		document.body.append(container);
		const root = await act(async () => hydrateRoot(container, <App {...PROPS} />));

		await userEvent.setup().click(screen.getByRole('radio', { name: 'Arbeidsgiver' }));

		await waitFor(() => expect(asked()).toHaveLength(1));
		act(() => root.unmount());
		container.remove();
	});
});

// Keeps the type in use for the helpers above
export type { SearchParams };
