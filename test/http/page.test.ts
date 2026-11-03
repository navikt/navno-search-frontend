import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
    APP_ORIGIN,
    BASE,
    expectNoUnexpectedHosts,
    fetchPage,
    startServer,
    type TestServer,
} from './harness';
import {
    DECORATOR_HOST,
    SEARCH_HITS,
    SEARCH_HOST,
    SEARCH_LANDING,
    SEARCH_PATH,
    searchReply,
} from './stub';
import {
    byText,
    checked,
    counts,
    fieldset,
    hitCard,
    hitLinks,
    inOrder,
    main,
    options,
    showMore,
    summary,
    text,
} from './dom';

const NO_STORE = 'private, no-cache, no-store, max-age=0, must-revalidate';
const IMMUTABLE = 'public, max-age=31536000, immutable';
const DESCRIPTION = 'Søk på hele nav.no. Du kan filtrere på innhold og dato.';

describe('search page', () => {
    let server: TestServer;

    beforeAll(async () => {
        server = await startServer({
            routes: [
                {
                    host: SEARCH_HOST,
                    path: SEARCH_PATH,
                    query: { ord: 'siste side' },
                    reply: (req) => searchReply(req, { isMore: false }),
                },
            ],
        });
    });

    afterAll(async () => {
        expectNoUnexpectedHosts(server);
        await server.stop();
    });

    test('is gzipped HTML that is never cached', async () => {
        const res = await server.fetch(`${BASE}?ord=dagpenger`, {
            headers: { 'accept-encoding': 'gzip' },
        });

        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')?.toLowerCase()).toBe(
            'text/html; charset=utf-8'
        );
        expect(res.headers.get('content-encoding')).toBe('gzip');
        expect(res.headers.get('cache-control')).toBe(NO_STORE);
    });

    test('has the document metadata', async () => {
        const { doc } = await fetchPage(server, `${BASE}?ord=dagpenger`);
        const meta = Object.fromEntries(
            [...doc.head.querySelectorAll('meta[name], meta[property]')].map(
                (m) => [
                    m.getAttribute('name') ?? m.getAttribute('property'),
                    m.getAttribute('content'),
                ]
            )
        );

        expect(doc.documentElement.lang).toBe('no');
        expect(doc.title).toBe('Søk - nav.no');
        expect(
            doc.head
                .querySelector('link[rel="canonical"]')
                ?.getAttribute('href')
        ).toBe(`${APP_ORIGIN}/sok`);
        expect(meta).toMatchObject({
            description: DESCRIPTION,
            robots: 'noindex, nofollow',
            'og:title': 'Søk - nav.no',
            'og:site_name': 'nav.no',
            'og:url': `${APP_ORIGIN}/sok`,
            'og:description': DESCRIPTION,
            'og:image': `${APP_ORIGIN}/gfx/social-share-fallback.png`,
            'twitter:card': 'summary_large_image',
            'twitter:domain': 'nav.no',
            'twitter:title': 'Søk - nav.no',
            'twitter:description': DESCRIPTION,
            'twitter:image:src': `${APP_ORIGIN}/gfx/social-share-fallback.png`,
        });
        expect(main(doc).getAttribute('tabindex')).toBe('-1');
        expect(text(main(doc).querySelector('h1'))).toBe('Søk på nav.no');
    });

    test('is wrapped in the decorator', async () => {
        const { doc } = await fetchPage(server, `${BASE}?ord=dagpenger`);
        const headAssets = doc.head.querySelector('[data-stub="head-assets"]');
        const header = doc.body.querySelector('[data-stub="decorator-header"]');
        const footer = doc.body.querySelector('[data-stub="decorator-footer"]');
        const scripts = doc.body.querySelector(
            '[data-stub="decorator-scripts"]'
        );

        expect(headAssets).not.toBeNull();
        expect(header).not.toBeNull();
        expect(footer).not.toBeNull();
        expect(scripts).not.toBeNull();
        expect(inOrder(header!, main(doc), footer!, scripts!)).toBe(true);

        // The app's styles come after the decorator's, so they win ties
        const appStyles = [
            ...doc.head.querySelectorAll(
                `link[rel="stylesheet"][href^="${BASE}/"]`
            ),
        ];
        expect(appStyles.length).toBeGreaterThan(0);
        expect(appStyles.every((link) => inOrder(headAssets!, link))).toBe(
            true
        );

        const asked = server.stub
            .find(DECORATOR_HOST, '/dekoratoren/ssr')
            .map((r) => ({
                chatbot: r.query.get('chatbot'),
                breadcrumbs: JSON.parse(r.query.get('breadcrumbs') ?? 'null'),
            }));
        expect(asked.length).toBeGreaterThan(0);
        for (const params of asked) {
            expect(params).toEqual({
                chatbot: 'true',
                breadcrumbs: [{ title: 'Søk', url: '/sok' }],
            });
        }
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
        const { doc } = await fetchPage(server, `${BASE}?${query}`);

        expect(
            doc
                .querySelector('[data-stub="decorator-header"]')
                ?.getAttribute('data-context')
        ).toBe(context);
    });

    test('shows the hits', async () => {
        const { doc } = await fetchPage(server, `${BASE}?ord=dagpenger`);
        const links = hitLinks(doc, SEARCH_HITS.hits);

        expect(summary(doc)).toEqual([
            `${SEARCH_HITS.total} treff for «dagpenger» med valgte søkefilter.`,
        ]);
        expect(links.map((a) => [a.getAttribute('href'), text(a)])).toEqual(
            SEARCH_HITS.hits.map((hit) => [hit.href, hit.displayName])
        );

        const [dagpenger, utdanning, mistet] = links.map(hitCard);
        // The highlight's markup is kept
        expect(text(dagpenger.querySelector('b'))).toBe('Dagpenger');
        expect(text(dagpenger)).toContain(
            'Dagpenger er en pengestøtte du kan få når du er arbeidsledig eller permittert.'
        );
        expect(text(utdanning.querySelector('b'))).toBe('dagpenger');
        expect(text(mistet.querySelector('b'))).toBe('dagpenger');
        // Audience tags, in the hit's language
        expect(byText(dagpenger, 'Privatperson')).toHaveLength(1);
        expect(byText(mistet, 'Privatperson')).toHaveLength(1);
        // Dates only when the hit has them
        expect(text(dagpenger)).not.toContain('Publisert');
        expect(
            byText(mistet, 'Publisert 11.08.2025 | Oppdatert 18.08.2025')
        ).toHaveLength(1);

        expect(showMore(doc)).toHaveLength(1);
        expect(showMore(doc)[0]).not.toBeNull();
    });

    test('has no "Vis flere treff" on the last page', async () => {
        const { doc } = await fetchPage(server, `${BASE}?ord=siste%20side`);

        expect(hitLinks(doc, SEARCH_HITS.hits)).toHaveLength(3);
        expect(showMore(doc)).toEqual([]);
    });

    test('shows the chosen search, filters and sorting', async () => {
        const { doc } = await fetchPage(
            server,
            `${BASE}?ord=x&f=arbeidsgiver&uf=informasjon&s=1&preferredLanguage=en`
        );
        const search = doc.querySelector<HTMLInputElement>(
            '[role="search"] input[type="search"]'
        );
        const facets = fieldset(doc, 'Søkefilter');
        const arbeidsgiver = SEARCH_HITS.aggregations.fasetter.buckets.find(
            (facet) => facet.key === 'arbeidsgiver'
        );

        expect(search?.value).toBe('x');
        expect(text(search?.labels?.[0])).toBe('Søk på siden');
        expect(options(fieldset(doc, 'Sorter etter:'), 'radio')).toEqual([
            ['0', 'Beste treff', false],
            ['1', 'Dato', true],
        ]);
        expect(options(fieldset(doc, 'Foretrukket språk'), 'radio')).toEqual([
            ['nb', 'Bokmål', false],
            ['nn', 'Nynorsk', false],
            ['en', 'English', true],
        ]);
        expect(checked(facets, 'radio')).toEqual(['arbeidsgiver']);
        expect(counts(facets, 'radio')).toEqual(
            SEARCH_HITS.aggregations.fasetter.buckets.map((facet) => [
                facet.key,
                facet.name,
                facet.docCount,
            ])
        );
        // Only the chosen facet's underfacets
        expect(checked(main(doc), 'checkbox')).toEqual(['informasjon']);
        expect(counts(main(doc), 'checkbox')).toEqual(
            arbeidsgiver?.underaggregeringer.buckets.map((underfacet) => [
                underfacet.key,
                underfacet.name,
                underfacet.docCount,
            ])
        );
        // The mobile filter toggle names the chosen facet
        expect(byText(main(doc), 'Søkefilter: Arbeidsgiver')).toHaveLength(1);
        expect(
            byText(main(doc), 'Søketips').map((a) => a.getAttribute('href'))
        ).toEqual(['/soketips']);
    });

    test.each([
        { query: '', name: 'for a bare URL' },
        { query: '?utm_source=test', name: 'with only tracking params' },
    ])('shows no hits before a search is made, $name', async ({ query }) => {
        const { doc } = await fetchPage(server, `${BASE}${query}`);

        expect(text(main(doc).querySelector('h1'))).toBe('Søk på nav.no');
        expect(checked(fieldset(doc, 'Søkefilter'), 'radio')).toEqual([
            'privatperson',
        ]);
        expect(summary(doc)).toEqual([]);
        expect(hitLinks(doc, SEARCH_LANDING.hits)).toEqual([]);
        expect(showMore(doc)).toEqual([]);
    });

    test('answers HEAD without a body', async () => {
        const res = await server.fetch(`${BASE}?ord=x`, { method: 'HEAD' });

        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')?.toLowerCase()).toBe(
            'text/html; charset=utf-8'
        );
        expect(await res.text()).toBe('');
    });

    test('answers unknown paths with an uncached 404 page', async () => {
        const res = await server.fetch(`${BASE}/finnes-ikke`);

        expect(res.status).toBe(404);
        expect(res.headers.get('content-type')?.toLowerCase()).toBe(
            'text/html; charset=utf-8'
        );
        expect(res.headers.get('cache-control')).toBe(NO_STORE);
    });

    test("serves the page's own styles and scripts as immutable", async () => {
        const { doc } = await fetchPage(server, `${BASE}?ord=dagpenger`);
        const styles = [
            ...doc.querySelectorAll(`link[rel="stylesheet"][href^="${BASE}/"]`),
        ].map((link) => link.getAttribute('href') ?? '');
        const scripts = [
            ...doc.querySelectorAll(`script[src^="${BASE}/"]`),
        ].map((script) => script.getAttribute('src') ?? '');

        expect(styles.length).toBeGreaterThan(0);
        expect(scripts.length).toBeGreaterThan(0);
        for (const [urls, type] of [
            [styles, /^text\/css\b/],
            [scripts, /^(application|text)\/javascript\b/],
        ] as const) {
            for (const url of urls) {
                const res = await server.fetch(url);
                await res.arrayBuffer();

                expect([url, res.status]).toEqual([url, 200]);
                expect(res.headers.get('content-type')).toMatch(type);
                expect(res.headers.get('cache-control')).toBe(IMMUTABLE);
            }
        }
    });
});
