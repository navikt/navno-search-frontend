import { Hono } from 'hono';
import { describe, expect, test } from 'vitest';
import { DEFAULTS, MAX_PAGE } from '#shared/search.ts';
import { parseParams, type PageQuery } from './params.ts';

const app = new Hono().get('/sok', parseParams, (c) => c.json(c.req.valid('query')));

const parse = async (query: string, cookies: Record<string, string> = {}): Promise<PageQuery> => {
	const cookie = Object.entries(cookies)
		.map(([name, value]) => `${name}=${value}`)
		.join('; ');
	const res = await app.request(`/sok${query}`, { headers: { cookie } });
	return res.json();
};

// app.test.ts has the decorator's context, through the page
describe('parseParams', () => {
	test('a bare URL is the page before a search, with the defaults', async () => {
		expect(await parse('')).toEqual({ params: DEFAULTS, landing: true, context: 'privatperson' });
	});

	test.each(['?ord=', '?f=privatperson', '?uf=', '?s=0', '?preferredLanguage=nb', '?page=0'])(
		'%s is a search, even with nothing in it',
		async (query) => {
			expect((await parse(query)).landing).toBe(false);
		}
	);

	test('tracking params are not a search', async () => {
		expect((await parse('?utm_source=x&utm_medium=y&c=1')).landing).toBe(true);
	});

	test('reads the search from the URL, decoded', async () => {
		expect(
			await parse('?ord=a%26b%20C%23%201%2B1&f=arbeidsgiver&uf=informasjon&uf=kontor&s=1&preferredLanguage=en&page=3')
		).toEqual({
			params: {
				ord: 'a&b C# 1+1',
				f: 'arbeidsgiver',
				uf: ['informasjon', 'kontor'],
				s: '1',
				preferredLanguage: 'en',
				page: 3,
			},
			landing: false,
			context: 'arbeidsgiver',
		});
	});

	test('takes underfacets comma-separated too, and drops empty ones', async () => {
		expect((await parse('?uf=informasjon,kontor,&uf=')).params.uf).toEqual(['informasjon', 'kontor']);
	});

	test('takes the first search term given', async () => {
		expect((await parse('?ord=a&ord=b')).params.ord).toBe('a');
	});

	const COOKIES = { 'decorator-context': 'samarbeidspartner', 'decorator-language': 'nn' };

	// The URL first, then the decorator's cookies, then the defaults
	test.each<{ query: string; cookies: Record<string, string>; f: string; preferredLanguage?: string }>([
		{ query: '', cookies: COOKIES, f: 'samarbeidspartner', preferredLanguage: 'nn' },
		{ query: '?f=presse&preferredLanguage=en', cookies: COOKIES, f: 'presse', preferredLanguage: 'en' },
		// An unknown facet gets the cookie's context
		{ query: '?f=finnes-ikke', cookies: { 'decorator-context': 'arbeidsgiver' }, f: 'arbeidsgiver' },
		{ query: '?f=finnes-ikke', cookies: {}, f: 'privatperson' },
		// So does one given twice
		{ query: '?f=arbeidsgiver&f=presse', cookies: {}, f: 'privatperson' },
		{ query: '?preferredLanguage=se', cookies: COOKIES, f: 'samarbeidspartner', preferredLanguage: 'nn' },
		// presse is a facet but not a decorator context, and se isn't a language the API takes
		{
			query: '',
			cookies: { 'decorator-context': 'presse', 'decorator-language': 'se' },
			f: 'privatperson',
			preferredLanguage: 'nb',
		},
	])(
		'$query with $cookies: f=$f, preferredLanguage=$preferredLanguage',
		async ({ query, cookies, f, preferredLanguage }) => {
			expect((await parse(query, cookies)).params).toMatchObject({ f, preferredLanguage: preferredLanguage ?? 'nb' });
		}
	);

	test.each([
		['', 0],
		['?page=-1', 0],
		['?page=abc', 0],
		['?page=2.5', 0],
		['?page=3&page=4', 0],
		['?page=3', 3],
		[`?page=${MAX_PAGE}`, MAX_PAGE],
		['?page=99', MAX_PAGE],
	])('page%s is %i', async (query, page) => {
		expect((await parse(query)).params.page).toBe(page);
	});

	test.each([
		['?s=1', '1'],
		['?s=0', '0'],
		['?s=2', '0'],
		['?s=1&s=1', '0'],
	])('sorting%s is %s', async (query, s) => {
		expect((await parse(query)).params.s).toBe(s);
	});
});
