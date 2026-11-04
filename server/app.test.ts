import { networkError, type MockReply } from '@itsy/corgi/testing';
import { logger } from '@navikt/pino-logger';
import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { installMockFetch } from '#test/fetch.ts';
import { searchResult } from '#test/fixtures.ts';
import { text } from '#test/render.ts';
import app from './app.ts';
import { NO_STORE } from './document.ts';

// The network under the app's fetch: the decorator, and the search API, whose answers a test can swap
const http = installMockFetch();
const SEARCH_API = 'http://navno-search-api.test/content/search';
const SEARCH_URL_API = 'http://navno-search-api.test/content/search-url';
const searchApi = (reply: MockReply | MockReply[]) => http.get(SEARCH_API, reply);
const searchUrlApi = (reply: MockReply | MockReply[]) => http.get(SEARCH_URL_API, reply);
const searches = () => http.callsTo(SEARCH_API).map((call) => call.query);

beforeEach(() => {
	// Outside a cluster, the decorator module calls www.nav.no. The header echoes what the page asked
	// for: the module caches its answers, so its calls can't be counted
	http.get('https://www.nav.no/dekoratoren/ssr', ({ query }) => ({
		json: {
			headAssets: '<link rel="stylesheet" href="https://www.nav.no/decorator.css" data-stub="head-assets">',
			header: `<div data-stub="decorator-header" data-context="${query.get('context')}" data-chatbot="${query.get('chatbot')}" data-breadcrumbs='${query.get('breadcrumbs')}'></div>`,
			footer: '<div data-stub="decorator-footer"></div>',
			scripts: '<script src="https://www.nav.no/decorator.js" data-stub="decorator-scripts"></script>',
			versionId: '1',
		},
	}));
	http.get('https://www.nav.no/dekoratoren/api/version', { json: { latestVersion: '1' } });
	searchApi(({ query }) => ({ json: searchResult({ word: query.get('ord') ?? '', fasettKey: query.get('f') ?? '' }) }));
	searchUrlApi(({ query }) => ({
		json:
			query.get('term') === 'dagpenger'
				? { url: 'https://www.nav.no/dagpenger', title: 'Dagpenger' }
				: { url: null, title: null },
	}));
});

afterEach(() => {
	vi.restoreAllMocks();
});

const get = async (path: string, init?: RequestInit) => {
	const res = await app.request(path, init);
	return { res, doc: new JSDOM(await res.text()).window.document };
};

const decoratorContext = (doc: Document) =>
	doc.querySelector('[data-stub="decorator-header"]')?.getAttribute('data-context');

describe('the search page', () => {
	test('is uncached HTML, in the decorator', async () => {
		const { res, doc } = await get('/sok?ord=dagpenger');
		const main = doc.querySelector('#maincontent');

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')?.toLowerCase()).toBe('text/html; charset=utf-8');
		expect(res.headers.get('cache-control')).toBe(NO_STORE);
		expect(doc.documentElement.lang).toBe('no');
		expect(doc.title).toBe('Søk - nav.no');
		expect(main?.getAttribute('tabindex')).toBe('-1');
		expect(text(main?.querySelector('.sok-summary h2'))).toBe('84 treff for «dagpenger» med valgte søkefilter.');

		const [header, footer, scripts] = ['decorator-header', 'decorator-footer', 'decorator-scripts'].map((stub) =>
			doc.body.querySelector(`[data-stub="${stub}"]`)
		);
		const order = [header, main, footer, scripts].map((node) => [...doc.body.querySelectorAll('*')].indexOf(node!));
		expect(order).toEqual(order.toSorted((a, b) => a - b));
		expect(order[0]).toBeGreaterThanOrEqual(0);
		expect(doc.head.querySelector('[data-stub="head-assets"]')).not.toBeNull();
	});

	test('has the metadata for sharing, and is not indexed', async () => {
		const { doc } = await get('/sok?ord=dagpenger');
		const meta = Object.fromEntries(
			[...doc.head.querySelectorAll('meta[name], meta[property]')].map((tag) => [
				tag.getAttribute('name') ?? tag.getAttribute('property'),
				tag.getAttribute('content'),
			])
		);
		const description = 'Søk på hele nav.no. Du kan filtrere på innhold og dato.';
		const image = 'https://www.nav.test/gfx/social-share-fallback.png';

		expect(doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://www.nav.test/sok');
		expect(meta).toMatchObject({
			description,
			robots: 'noindex, nofollow',
			'og:title': 'Søk - nav.no',
			'og:site_name': 'nav.no',
			'og:url': 'https://www.nav.test/sok',
			'og:description': description,
			'og:image': image,
			'twitter:card': 'summary_large_image',
			'twitter:domain': 'nav.no',
			'twitter:title': 'Søk - nav.no',
			'twitter:description': description,
			'twitter:image:src': image,
		});
	});

	test("puts the app's styles after the decorator's, and loads its script after the decorator's", async () => {
		const { doc } = await get('/sok?ord=dagpenger');
		const all = [...doc.querySelectorAll('*')];
		const at = (selector: string) => all.indexOf(doc.querySelector(selector)!);

		expect(at('[data-stub="head-assets"]')).toBeLessThan(at('link[href$="client/styles.css"]'));
		expect(at('[data-stub="decorator-scripts"]')).toBeLessThan(at('script[src$="client/main-client.tsx"]'));
	});

	test('is compressed', async () => {
		const res = await app.request('/sok?ord=dagpenger', { headers: { 'accept-encoding': 'gzip' } });

		expect(res.headers.get('content-encoding')).toBe('gzip');
	});

	test('answers HEAD without a body', async () => {
		const res = await app.request('/sok?ord=dagpenger', { method: 'HEAD' });

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')?.toLowerCase()).toBe('text/html; charset=utf-8');
		expect(await res.text()).toBe('');
	});

	test('is at /sok/ too', async () => {
		const { res, doc } = await get('/sok/?ord=dagpenger');

		expect(res.status).toBe(200);
		expect(doc.querySelector('form.sok-page')).not.toBeNull();
	});

	test.each(['uf=informasjon&uf=kontor', 'uf=informasjon,kontor'])(
		'passes the search on to the API, with %s',
		async (uf) => {
			await get(`/sok?ord=dagpenger%20s%C3%B8knad&f=arbeidsgiver&${uf}&s=1&preferredLanguage=en`);

			expect(searches().map((query) => Array.from(query))).toEqual([
				[
					['ord', 'dagpenger søknad'],
					['f', 'arbeidsgiver'],
					['uf', 'informasjon,kontor'],
					['s', '1'],
					['preferredLanguage', 'en'],
					['page', '0'],
				],
			]);
		}
	);

	test('asks the decorator for the chatbot and the Søk breadcrumb', async () => {
		const header = (await get('/sok?ord=dagpenger')).doc.querySelector('[data-stub="decorator-header"]');

		expect(header?.getAttribute('data-chatbot')).toBe('true');
		expect(JSON.parse(header?.getAttribute('data-breadcrumbs') ?? 'null')).toEqual([{ title: 'Søk', url: '/sok' }]);
	});

	test.each([
		['f=privatperson', 'privatperson'],
		['f=arbeidsgiver', 'arbeidsgiver'],
		['f=samarbeidspartner', 'samarbeidspartner'],
		['f=presse', 'privatperson'],
		['f=finnes-ikke', 'privatperson'],
		['f=arbeidsgiver&f=samarbeidspartner', 'privatperson'],
		['ord=x', 'privatperson'],
	])('?%s gets the %s decorator', async (query, context) => {
		expect(decoratorContext((await get(`/sok?${query}`)).doc)).toBe(context);
	});

	test("searches with the decorator's cookies, but its context still comes from the URL", async () => {
		const { doc } = await get('/sok', { headers: { cookie: 'decorator-context=arbeidsgiver; decorator-language=nn' } });

		expect(searches().map((query) => [query.get('f'), query.get('preferredLanguage')])).toEqual([
			['arbeidsgiver', 'nn'],
		]);
		expect(decoratorContext(doc)).toBe('privatperson');
	});

	test('shows the unfiltered listing when the search fails', async () => {
		searchApi(({ query }) =>
			query.get('ord') === 'feil' ? { status: 500 } : { json: searchResult({ word: '', total: 850 }) }
		);

		const { res, doc } = await get('/sok?ord=feil&f=arbeidsgiver');

		expect(res.status).toBe(200);
		expect(searches().map((query) => [query.get('ord'), query.get('f')])).toEqual([
			['feil', 'arbeidsgiver'],
			['', 'privatperson'],
		]);
		expect(text(doc.querySelector('.sok-summary h2'))).toBe('850 treff med valgte søkefilter.');
	});

	test('says so when the search service is down', async () => {
		searchApi({ status: 503 });

		const { res, doc } = await get('/sok?ord=dagpenger');

		expect(res.status).toBe(200);
		expect(text(doc.querySelector('#maincontent [role="alert"]'))).toBe('Feil - søketjenesten er ikke tilgjengelig');
	});
});

describe('other paths', () => {
	test.each([
		['GET', '/sok/finnes-ikke'],
		['POST', '/sok'],
		['GET', '/sok/assets/main.js'],
	])('%s %s is a decorated, uncached 404 page', async (method, path) => {
		const { res, doc } = await get(path, { method });

		expect(res.status).toBe(404);
		expect(res.headers.get('content-type')?.toLowerCase()).toBe('text/html; charset=utf-8');
		expect(res.headers.get('cache-control')).toBe(NO_STORE);
		expect(text(doc.querySelector('#maincontent h1'))).toBe('Fant ikke siden');
		expect(decoratorContext(doc)).toBe('privatperson');
	});
});

describe('internal endpoints', () => {
	test.each([
		['isAlive', 'I am alive!'],
		['isReady', 'I am ready!'],
	])('%s', async (probe, message) => {
		const res = await app.request(`/sok/api/internal/${probe}`);

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toMatch(/^application\/json\b/);
		expect(await res.json()).toEqual({ message });
	});

	test('metrics, in the Prometheus text format, with every series from the start', async () => {
		const res = await app.request('/sok/api/internal/metrics');
		const body = await res.text();

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toBe('text/plain; version=0.0.4; charset=utf-8');
		expect(body).toMatch(/^# TYPE navno_search_requests_total counter$/m);
		expect(body).toMatch(/^# TYPE navno_search_upstream_duration_seconds histogram$/m);
		for (const series of [
			'navno_search_requests_total{status="success"}',
			'navno_search_requests_total{status="error"}',
			'navno_search_upstream_duration_seconds_count{status="success"}',
			'navno_search_upstream_duration_seconds_count{status="error"}',
		]) {
			expect(body).toContain(`\n${series} `);
		}
	});
});

describe('hydration', () => {
	test('the page hands the browser the props it was rendered with, outside <main>', async () => {
		const { doc } = await get('/sok?ord=dagpenger&f=arbeidsgiver');
		const script = doc.querySelector('script#app-props');
		const props = JSON.parse(script?.textContent ?? 'null');

		expect(script?.getAttribute('type')).toBe('application/json');
		expect(script?.closest('main')).toBeNull();
		expect(props).toMatchObject({
			params: { ord: 'dagpenger', f: 'arbeidsgiver', uf: [], s: '0', preferredLanguage: 'nb', page: 0 },
			landing: false,
			result: { word: 'dagpenger', total: 84 },
		});
	});

	test('a search term cannot end the props script', async () => {
		const ord = '</script><script>alert(1)</script>';
		const res = await app.request(`/sok?ord=${encodeURIComponent(ord)}`);
		const html = await res.text();
		const doc = new JSDOM(html).window.document;

		expect(html).not.toContain('</script><script>alert(1)');
		expect(JSON.parse(doc.querySelector('#app-props')?.textContent ?? 'null').params.ord).toBe(ord);
	});

	test('<main> holds the app and nothing else, as hydration needs', async () => {
		const { doc } = await get('/sok?ord=dagpenger');
		const main = doc.querySelector('#maincontent');

		expect([...(main?.childNodes ?? [])].map((node) => node.nodeName)).toEqual(['FORM']);
	});

	test('the page before a search and the error page hand over props too', async () => {
		const landing = JSON.parse((await get('/sok')).doc.querySelector('#app-props')?.textContent ?? 'null');
		searchApi({ status: 503 });
		const down = JSON.parse((await get('/sok?ord=x')).doc.querySelector('#app-props')?.textContent ?? 'null');

		expect(landing).toMatchObject({ landing: true, params: { ord: '' } });
		expect(down).toMatchObject({ result: null, landing: false });
	});
});

describe('/sok/api/search', () => {
	test('answers with the one page the browser asks for', async () => {
		const res = await app.request(
			`/sok/api/search?ord=${encodeURIComponent('a&b C#')}&f=arbeidsgiver&uf=informasjon&s=1&preferredLanguage=en&page=2`
		);

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')?.split(';')[0]).toBe('application/json');
		expect(res.headers.get('cache-control')).toBe(NO_STORE);
		expect(await res.json()).toMatchObject({ word: 'a&b C#', fasettKey: 'arbeidsgiver' });
		expect(searches().map((query) => Object.fromEntries(query))).toEqual([
			{ ord: 'a&b C#', f: 'arbeidsgiver', uf: 'informasjon', s: '1', preferredLanguage: 'en', page: '2' },
		]);
	});

	test('502 when the search fails, without the fallback a page gets', async () => {
		searchApi({ status: 500 });

		const res = await app.request('/sok/api/search?ord=x');

		expect(res.status).toBe(502);
		expect(await res.json()).toEqual({ error: 'Search failed' });
		expect(searches()).toHaveLength(1);
	});

	test('logs a failed search without its URL, which has the search term', async () => {
		const error = vi.spyOn(logger, 'error');
		searchApi({ status: 500 });

		await app.request('/sok/api/search?ord=hemmelig');

		expect(error.mock.calls).toEqual([[{ status: 500, facet: 'privatperson', page: 0 }, 'Search failed']]);
	});
});

describe('/sok/api/search-url', () => {
	test.each([
		['dagpenger', { url: 'https://www.nav.no/dagpenger', title: 'Dagpenger' }],
		['ukjent', { url: null, title: null }],
	])("answers with the API's URL for %s", async (term, answer) => {
		const res = await app.request(`/sok/api/search-url?term=${term}`);

		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toMatch(/^application\/json\b/);
		expect(await res.json()).toEqual(answer);
	});

	test('passes the term on encoded', async () => {
		await app.request(`/sok/api/search-url?term=${encodeURIComponent('a&b c#d+e=f')}`);

		expect(http.callsTo(SEARCH_URL_API).map((call) => call.query.get('term'))).toEqual(['a&b c#d+e=f']);
	});

	test.each(['', '?term=%20%20', '?term=a&term=b'])(
		'400 for the term in "%s", without asking the API',
		async (query) => {
			const res = await app.request(`/sok/api/search-url${query}`);

			expect(res.status).toBe(400);
			expect(await res.json()).toEqual({ error: 'A single non-empty term is required' });
			expect(http.callsTo(SEARCH_URL_API)).toEqual([]);
		}
	);

	test("passes on the API's error status", async () => {
		searchUrlApi({ status: 503 });

		const res = await app.request('/sok/api/search-url?term=x');

		expect(res.status).toBe(503);
		expect(await res.json()).toEqual({ error: 'Failed to fetch search URL' });
	});

	test("logs the API's error status without the term", async () => {
		const error = vi.spyOn(logger, 'error');
		searchUrlApi({ status: 503 });

		await app.request('/sok/api/search-url?term=hemmelig');

		expect(error.mock.calls).toEqual([[{ status: 503 }, 'Failed to fetch search URL']]);
	});

	test('500 when the API is unreachable', async () => {
		searchUrlApi(networkError());

		const res = await app.request('/sok/api/search-url?term=x');

		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: 'Failed to fetch search URL' });
	});

	test('405 for other methods than GET', async () => {
		const res = await app.request('/sok/api/search-url?term=x', { method: 'POST' });

		expect(res.status).toBe(405);
		expect(res.headers.get('allow')).toBe('GET');
		expect(await res.json()).toEqual({ error: 'Method not allowed' });
		expect(http.callsTo(SEARCH_URL_API)).toEqual([]);
	});
});
