import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
    BASE,
    expectNoUnexpectedHosts,
    parseHtml,
    startServer,
    type TestServer,
} from './harness';
import { SEARCH_HITS, SEARCH_HOST, SEARCH_LANDING, SEARCH_PATH } from './stub';
import { checked, fieldset, hitLinks, main, summary, text } from './dom';

// What the search API was asked for, with the API's own defaults filled in,
// so that sending a default and leaving it out read the same
const asked = (query: URLSearchParams) => ({
    ord: query.get('ord') ?? '',
    f: query.get('f') ?? 'privatperson',
    uf: query
        .getAll('uf')
        .flatMap((value) => value.split(','))
        .filter(Boolean),
    s: query.get('s') ?? '0',
    preferredLanguage: query.get('preferredLanguage') ?? 'nb',
    page: query.get('page') ?? '0',
});

const DEFAULTS = asked(new URLSearchParams());

const DOWN = { status: 500, body: 'Internal Server Error' };

// Loads a page and returns it with the searches it made
const search = async (server: TestServer, path: string, init?: RequestInit) => {
    const before = server.stub.requests.length;
    const res = await server.fetch(path, init);
    const doc = parseHtml(await res.text());
    const calls = server.stub.requests
        .slice(before)
        .filter((r) => r.host === SEARCH_HOST && r.path === SEARCH_PATH)
        .map((r) => asked(r.query));
    return { res, doc, calls };
};

describe('searching navno-search-api', () => {
    let server: TestServer;

    beforeAll(async () => {
        server = await startServer({
            routes: [
                // Only this term fails, so the fallback search succeeds
                {
                    host: SEARCH_HOST,
                    path: SEARCH_PATH,
                    query: { ord: 'feil' },
                    reply: () => DOWN,
                },
            ],
        });
    });

    afterAll(async () => {
        expectNoUnexpectedHosts(server);
        await server.stop();
    });

    test.each([
        ['repeated', 'uf=informasjon&uf=kontor'],
        ['comma-separated', 'uf=informasjon,kontor'],
    ])('passes the search on, with %s underfacets', async (_, uf) => {
        const { res, calls } = await search(
            server,
            `${BASE}?ord=dagpenger%20s%C3%B8knad&f=arbeidsgiver&${uf}&s=1&preferredLanguage=en`
        );

        expect(res.status).toBe(200);
        expect(calls).toEqual([
            {
                ord: 'dagpenger søknad',
                f: 'arbeidsgiver',
                uf: ['informasjon', 'kontor'],
                s: '1',
                preferredLanguage: 'en',
                page: '0',
            },
        ]);
    });

    const COOKIES =
        'decorator-context=samarbeidspartner; decorator-language=nn';

    // The decorator's cookies fill in what the URL leaves out
    test.each([
        {
            url: BASE,
            cookie: COOKIES,
            f: 'samarbeidspartner',
            preferredLanguage: 'nn',
        },
        {
            url: `${BASE}?f=arbeidsgiver`,
            cookie: COOKIES,
            f: 'arbeidsgiver',
            preferredLanguage: 'nn',
        },
        {
            url: `${BASE}?preferredLanguage=en`,
            cookie: COOKIES,
            f: 'samarbeidspartner',
            preferredLanguage: 'en',
        },
        // presse is a facet, but not a decorator context
        {
            url: BASE,
            cookie: 'decorator-context=presse; decorator-language=se',
            f: 'privatperson',
            preferredLanguage: 'nb',
        },
    ])(
        '$url with "$cookie" searches f=$f, preferredLanguage=$preferredLanguage',
        async ({ url, cookie, f, preferredLanguage }) => {
            const { calls } = await search(server, url, {
                headers: { cookie },
            });

            expect(calls).toEqual([{ ...DEFAULTS, f, preferredLanguage }]);
        }
    );

    test('the decorator context comes from the URL only', async () => {
        const { doc } = await search(server, BASE, {
            headers: { cookie: COOKIES },
        });

        expect(
            doc
                .querySelector('[data-stub="decorator-header"]')
                ?.getAttribute('data-context')
        ).toBe('privatperson');
    });

    test('an unknown facet searches the default facet instead', async () => {
        const { doc, calls } = await search(
            server,
            `${BASE}?ord=x&f=finnes-ikke`
        );

        expect(calls).toEqual([{ ...DEFAULTS, ord: 'x' }]);
        expect(checked(fieldset(doc, 'Søkefilter'), 'radio')).toEqual([
            'privatperson',
        ]);
        expect(summary(doc)).toEqual([
            `${SEARCH_HITS.total} treff for «x» med valgte søkefilter.`,
        ]);
        expect(hitLinks(doc, SEARCH_HITS.hits)).toHaveLength(3);
    });

    test('an unknown facet without a search term shows hits for the context cookie', async () => {
        const { doc, calls } = await search(server, `${BASE}?f=finnes-ikke`, {
            headers: { cookie: 'decorator-context=arbeidsgiver' },
        });

        expect(calls).toEqual([{ ...DEFAULTS, f: 'arbeidsgiver' }]);
        expect(checked(fieldset(doc, 'Søkefilter'), 'radio')).toEqual([
            'arbeidsgiver',
        ]);
        expect(summary(doc)).toEqual([
            `${SEARCH_LANDING.total} treff med valgte søkefilter.`,
        ]);
        expect(hitLinks(doc, SEARCH_LANDING.hits)).toHaveLength(3);
    });

    test('a failed search falls back to everything for privatperson', async () => {
        const { res, doc, calls } = await search(
            server,
            `${BASE}?ord=feil&f=arbeidsgiver&uf=informasjon&s=1&preferredLanguage=en`,
            { headers: { cookie: COOKIES } }
        );

        expect(res.status).toBe(200);
        expect(calls).toEqual([
            {
                ord: 'feil',
                f: 'arbeidsgiver',
                uf: ['informasjon'],
                s: '1',
                preferredLanguage: 'en',
                page: '0',
            },
            DEFAULTS,
        ]);
        expect(summary(doc)).toEqual([
            `${SEARCH_LANDING.total} treff med valgte søkefilter.`,
        ]);
        expect(hitLinks(doc, SEARCH_LANDING.hits)).toHaveLength(3);
    });
});

describe('when navno-search-api is down', () => {
    let server: TestServer;

    beforeAll(async () => {
        server = await startServer({
            routes: [
                { host: SEARCH_HOST, path: SEARCH_PATH, reply: () => DOWN },
            ],
        });
    });

    afterAll(async () => {
        expectNoUnexpectedHosts(server);
        await server.stop();
    });

    test('the page says so', async () => {
        const { res, doc, calls } = await search(server, `${BASE}?ord=x`);

        expect(res.status).toBe(200);
        expect(calls).toEqual([{ ...DEFAULTS, ord: 'x' }, DEFAULTS]);
        expect(text(main(doc).querySelector('[role="alert"]'))).toBe(
            'Feil - søketjenesten er ikke tilgjengelig'
        );
        expect(summary(doc)).toEqual([]);
    });
});
