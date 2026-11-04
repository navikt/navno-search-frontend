import { timeoutError, type MockReply } from '@itsy/corgi/testing';
import { Hono } from 'hono';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { registry } from '#server/metrics.ts';
import { installMockFetch } from '#test/fetch.ts';
import { hit, searchResult } from '#test/fixtures.ts';
import { DEFAULTS, type SearchParams } from '#shared/search.ts';
import { parseParams } from './params.ts';
import { searchPage, searchPages } from './upstream.ts';

const http = installMockFetch();

afterEach(() => {
	vi.useRealTimers();
});

// The API's answer to each call
const api = (reply: MockReply | MockReply[]) => http.get('http://navno-search-api.test/content/search', reply);

const asked = () => http.calls.map((call) => Object.fromEntries(call.query));

const search = (params: Partial<SearchParams>) => searchPages({ ...DEFAULTS, ...params });

describe('the query to the API', () => {
	test('encodes the search term, so &, #, + and = reach the API as typed', async () => {
		api({ json: searchResult() });

		await searchPage({ ...DEFAULTS, ord: 'a&b C# 1+1 x=y' });

		expect(asked().map((query) => query.ord)).toEqual(['a&b C# 1+1 x=y']);
		expect(asked().map((query) => Object.keys(query))).toEqual([['ord', 'f', 's', 'preferredLanguage', 'page']]);
	});

	test('joins the underfacets with commas, and leaves out none', async () => {
		api({ json: searchResult() });

		await searchPage({ ...DEFAULTS, uf: ['informasjon', 'kontor'] });
		await searchPage(DEFAULTS);

		expect(asked().map((query) => query.uf)).toEqual(['informasjon,kontor', undefined]);
	});

	test("leaves out the page's own params", async () => {
		api({ json: searchResult() });
		const app = new Hono().get('/sok', parseParams, async (c) => c.json(await searchPage(c.req.valid('query').params)));

		await app.request('/sok?ord=x&utm_source=y&c=1');

		expect(asked().map((query) => Object.keys(query))).toEqual([['ord', 'f', 's', 'preferredLanguage', 'page']]);
	});
});

describe('searchPages', () => {
	test('asks for pages 0..page at once, and joins their hits in order', async () => {
		api(({ query }) => {
			const page = Number(query.get('page'));
			return {
				json: searchResult({
					page,
					total: 10 + page,
					isMore: page < 2,
					hits: [hit({ displayName: `Treff ${page}`, href: `https://www.nav.no/${page}` })],
				}),
				// The first page answers last
				delay: page === 0 ? 20 : 0,
			};
		});

		const found = await search({ ord: 'dagpenger', page: 2 });

		expect(asked().map((query) => query.page)).toEqual(['0', '1', '2']);
		expect(found?.result.hits.map((h) => h.displayName)).toEqual(['Treff 0', 'Treff 1', 'Treff 2']);
		// The rest is the last page's
		expect(found?.result).toMatchObject({ page: 2, total: 12, isMore: false });
		expect(found?.params).toMatchObject({ ord: 'dagpenger', page: 2 });
	});

	test('falls back to the unfiltered listing when the search fails', async () => {
		api(({ query }) => (query.get('ord') === 'feil' ? { status: 500 } : { json: searchResult({ word: '' }) }));

		const found = await search({ ord: 'feil', f: 'arbeidsgiver', uf: ['informasjon'], s: '1' });

		expect(asked()).toEqual([
			{ ord: 'feil', f: 'arbeidsgiver', uf: 'informasjon', s: '1', preferredLanguage: 'nb', page: '0' },
			{ ord: '', f: 'privatperson', s: '0', preferredLanguage: 'nb', page: '0' },
		]);
		expect(found?.params).toEqual(DEFAULTS);
		expect(found?.result.word).toBe('');
	});

	test('one failing page fails the search', async () => {
		api(({ query }) => (query.get('page') === '1' ? { status: 502 } : { json: searchResult() }));

		const found = await search({ ord: 'dagpenger', page: 1 });

		expect(found?.params).toEqual(DEFAULTS);
	});

	test('null when the fallback fails too', async () => {
		api({ status: 500 });

		expect(await search({ ord: 'dagpenger' })).toBeNull();
		expect(http.calls).toHaveLength(2);
	});

	test('a call that times out fails the search', async () => {
		api([timeoutError(), { json: searchResult() }]);

		const found = await search({ ord: 'dagpenger', f: 'presse' });

		expect(found?.params).toEqual(DEFAULTS);
	});

	test('counts searches and calls by outcome', async () => {
		const count = async (series: string) =>
			Number((await registry.metrics()).match(new RegExp(`^${series} (\\d+)$`, 'm'))?.[1]);
		const searches = (status: string) => count(`navno_search_requests_total\\{status="${status}"\\}`);
		const calls = (status: string) => count(`navno_search_upstream_duration_seconds_count\\{status="${status}"\\}`);
		const before = {
			searches: [await searches('success'), await searches('error')],
			calls: [await calls('success'), await calls('error')],
		};
		api(({ query }) => (query.get('ord') === 'feil' ? { status: 500 } : { json: searchResult() }));

		await search({ ord: 'feil', page: 1 });

		// Two calls for the failed search, one for the fallback
		expect([await searches('success'), await searches('error')]).toEqual([
			before.searches[0] + 1,
			before.searches[1] + 1,
		]);
		expect([await calls('success'), await calls('error')]).toEqual([before.calls[0] + 1, before.calls[1] + 2]);
	});
});

describe('searchPage', () => {
	test('asks for only the page the browser wants', async () => {
		api(({ query }) => ({
			json: searchResult({ page: Number(query.get('page')), hits: [hit({ displayName: 'Treff 3' })] }),
		}));

		const result = await searchPage({ ...DEFAULTS, ord: 'dagpenger', page: 3 });

		expect(asked().map((query) => query.page)).toEqual(['3']);
		expect(result.hits.map((h) => h.displayName)).toEqual(['Treff 3']);
	});

	test('fails without a fallback', async () => {
		api({ status: 500 });

		await expect(searchPage({ ...DEFAULTS, ord: 'dagpenger' })).rejects.toThrow('HTTP 500');
		expect(http.calls).toHaveLength(1);
	});

	test('gives the call 5 seconds, reading its body included', async () => {
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
		// The headers at once, the body never
		api({ status: 200, headers: { 'content-type': 'application/json' }, body: new ReadableStream() });

		const result = searchPage({ ...DEFAULTS, ord: 'dagpenger' });
		const settled = vi.fn();
		result.then(settled, settled);
		await vi.advanceTimersByTimeAsync(4999);
		expect(settled).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(1);

		await expect(result).rejects.toThrow('Request timed out after 5000ms');
	});
});
