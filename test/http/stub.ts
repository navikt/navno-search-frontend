import http from 'node:http';
import type { AddressInfo } from 'node:net';
import SEARCH_HITS from './fixtures/search-dagpenger.json';
import SEARCH_LANDING from './fixtures/search-landing.json';

/*
 * Stand-in for every service outside the app (the decorator and
 * navno-search-api). The server's outbound fetches are rerouted here by
 * preload.mts, with the original host in the Host header.
 */

// Captured from https://navno-search-api.nav.no/content/search (?ord=dagpenger
// and ?ord=) on 2026-11-03 and trimmed to 3 hits, so they are in the wire shape
export { SEARCH_HITS, SEARCH_LANDING };

export const SEARCH_HOST = 'navno-search-api.test';
export const SEARCH_PATH = '/content/search';
export const SEARCH_URL_PATH = '/content/search-url';
export const DECORATOR_HOST = 'www.nav.no';

export type StubRequest = {
    host: string;
    method: string;
    path: string;
    query: URLSearchParams;
    headers: http.IncomingHttpHeaders;
    body: string;
};

export type StubReply =
    | { status?: number; headers?: Record<string, string>; body?: unknown }
    | 'destroy';

export type StubRoute = {
    host: string;
    path: string | RegExp;
    method?: string;
    // Every listed query param must have exactly this value
    query?: Record<string, string>;
    reply: (req: StubRequest) => StubReply;
};

export type Stub = {
    origin: string;
    requests: StubRequest[];
    unexpected: StubRequest[];
    // Routes added later take precedence over the defaults
    route: (route: StubRoute) => void;
    find: (host: string, path?: string | RegExp) => StubRequest[];
    close: () => Promise<void>;
};

export const json = (body: unknown, status = 200): StubReply => ({
    status,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
});

// The header echoes the context, so a test can tell which decorator a page got
// even when the decorator module serves it from its cache
const decoratorReply = (req: StubRequest) =>
    json({
        headAssets:
            '<link rel="stylesheet" href="https://stub.test/decorator.css" data-stub="head-assets" />',
        header: `<div data-stub="decorator-header" data-context="${req.query.get('context')}"></div>`,
        footer: '<div data-stub="decorator-footer"></div>',
        scripts:
            '<script src="https://stub.test/decorator.js" data-stub="decorator-scripts"></script>',
        versionId: '1',
    });

type SearchResponse = typeof SEARCH_HITS;

// Like navno-search-api: echoes the params and marks the chosen facet and
// underfacets as checked. The underfacet check applies to every facet that has
// the key, as the API does. Answers 500 for an unknown facet, as the API does.
export const searchReply = (
    req: StubRequest,
    overrides: Partial<SearchResponse> = {}
): StubReply => {
    const { query } = req;
    const ord = query.get('ord') ?? '';
    const f = query.get('f') ?? 'privatperson';
    const uf = query
        .getAll('uf')
        .flatMap((value) => value.split(','))
        .filter(Boolean);
    const base: SearchResponse = ord ? SEARCH_HITS : SEARCH_LANDING;
    const facets = base.aggregations.fasetter.buckets;

    if (!facets.some((facet) => facet.key === f)) {
        return json(
            {
                status: 500,
                error: 'Internal Server Error',
                message: 'Ukjent feil',
                path: SEARCH_PATH,
            },
            500
        );
    }

    return json({
        ...base,
        page: Number(query.get('page') ?? 0),
        s: Number(query.get('s') ?? 0),
        preferredLanguage: query.get('preferredLanguage') ?? 'nb',
        word: ord,
        fasettKey: f,
        aggregations: {
            fasetter: {
                buckets: facets.map((facet) => ({
                    ...facet,
                    checked: facet.key === f,
                    underaggregeringer: {
                        buckets: facet.underaggregeringer.buckets.map(
                            (underfacet) => ({
                                ...underfacet,
                                checked: uf.includes(underfacet.key),
                            })
                        ),
                    },
                })),
            },
        },
        ...overrides,
    });
};

// Unknown terms get nulls, as from the API
const searchUrlReply = (req: StubRequest) =>
    json(
        req.query.get('term') === 'dagpenger'
            ? { url: 'https://www.nav.no/dagpenger', title: 'Dagpenger' }
            : { url: null, title: null }
    );

const defaultRoutes: StubRoute[] = [
    { host: DECORATOR_HOST, path: '/dekoratoren/ssr', reply: decoratorReply },
    {
        host: DECORATOR_HOST,
        path: '/dekoratoren/api/version',
        reply: () => json({ latestVersion: '1' }),
    },
    { host: SEARCH_HOST, path: SEARCH_PATH, reply: (req) => searchReply(req) },
    { host: SEARCH_HOST, path: SEARCH_URL_PATH, reply: searchUrlReply },
];

const matches = (route: StubRoute, req: StubRequest) =>
    route.host === req.host &&
    (!route.method || route.method === req.method) &&
    (typeof route.path === 'string'
        ? route.path === req.path
        : route.path.test(req.path)) &&
    Object.entries(route.query ?? {}).every(
        ([key, value]) => req.query.get(key) === value
    );

export const startStub = async (
    extraRoutes: StubRoute[] = []
): Promise<Stub> => {
    const routes = [...extraRoutes, ...defaultRoutes];
    const requests: StubRequest[] = [];
    const unexpected: StubRequest[] = [];

    const server = http.createServer(async (incoming, res) => {
        const chunks: Buffer[] = [];
        for await (const chunk of incoming) {
            chunks.push(chunk as Buffer);
        }

        const url = new URL(incoming.url ?? '/', 'http://stub');
        const req: StubRequest = {
            host: incoming.headers.host ?? '',
            method: incoming.method ?? 'GET',
            path: url.pathname,
            query: url.searchParams,
            headers: incoming.headers,
            body: Buffer.concat(chunks).toString('utf-8'),
        };
        requests.push(req);

        const route = routes.find((r) => matches(r, req));
        if (!route) {
            unexpected.push(req);
            res.writeHead(502, { 'content-type': 'text/plain' }).end(
                `No stub for ${req.method} ${req.host}${req.path}`
            );
            return;
        }

        const reply = route.reply(req);
        if (reply === 'destroy') {
            res.socket?.destroy();
            return;
        }

        const { status = 200, headers = {}, body } = reply;
        res.writeHead(status, headers).end(
            typeof body === 'string'
                ? body
                : body === undefined
                  ? ''
                  : JSON.stringify(body)
        );
    });
    server.keepAliveTimeout = 60_000;

    await new Promise<void>((resolve) =>
        server.listen(0, '127.0.0.1', resolve)
    );
    const { port } = server.address() as AddressInfo;

    return {
        origin: `http://127.0.0.1:${port}`,
        requests,
        unexpected,
        route: (route) => routes.unshift(route),
        find: (host, path) =>
            requests.filter(
                (r) =>
                    r.host === host &&
                    (path === undefined ||
                        (typeof path === 'string'
                            ? r.path === path
                            : path.test(r.path)))
            ),
        close: () =>
            new Promise<void>((resolve) => {
                server.closeAllConnections();
                server.close(() => resolve());
            }),
    };
};
