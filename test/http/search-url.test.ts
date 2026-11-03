import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
    BASE,
    expectNoUnexpectedHosts,
    startServer,
    type TestServer,
} from './harness';
import { json, SEARCH_HOST, SEARCH_URL_PATH } from './stub';

const PATH = `${BASE}/api/search-url`;
const FAILED = { error: 'Failed to fetch search URL' };

describe('search URL lookup', () => {
    let server: TestServer;

    beforeAll(async () => {
        server = await startServer({
            routes: [
                {
                    host: SEARCH_HOST,
                    path: SEARCH_URL_PATH,
                    query: { term: 'nede' },
                    reply: () => json({ error: 'Service Unavailable' }, 503),
                },
                {
                    host: SEARCH_HOST,
                    path: SEARCH_URL_PATH,
                    query: { term: 'brudd' },
                    reply: () => 'destroy',
                },
            ],
        });
    });

    afterAll(async () => {
        expectNoUnexpectedHosts(server);
        await server.stop();
    });

    // Fetches a lookup and returns it with the lookups it made upstream
    const lookup = async (query: string, init?: RequestInit) => {
        const before = server.stub.requests.length;
        const res = await server.fetch(`${PATH}${query}`, init);
        const body = await res.json();
        const calls = server.stub.requests
            .slice(before)
            .filter((r) => r.host === SEARCH_HOST && r.path === SEARCH_URL_PATH)
            .map((r) => [...r.query]);
        return { res, body, calls };
    };

    test.each([
        [
            'dagpenger',
            { url: 'https://www.nav.no/dagpenger', title: 'Dagpenger' },
        ],
        ['ukjent', { url: null, title: null }],
    ])("answers with the API's answer for %s", async (term, answer) => {
        const { res, body, calls } = await lookup(`?term=${term}`);

        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')?.split(';')[0]).toBe(
            'application/json'
        );
        expect(body).toEqual(answer);
        expect(calls).toEqual([[['term', term]]]);
    });

    test('passes the term on encoded', async () => {
        const term = 'a&b c#d+e=f';
        const { calls } = await lookup(`?term=${encodeURIComponent(term)}`);

        expect(calls).toEqual([[['term', term]]]);
    });

    test.each([
        ['missing', ''],
        ['blank', '?term=%20%20'],
        ['repeated', '?term=a&term=b'],
    ])('400 for a %s term, without asking the API', async (_, query) => {
        const { res, body, calls } = await lookup(query);

        expect(res.status).toBe(400);
        expect(body).toEqual({
            error: 'A single non-empty term is required',
        });
        expect(calls).toEqual([]);
    });

    test("passes on the API's error status", async () => {
        const { res, body } = await lookup('?term=nede');

        expect(res.status).toBe(503);
        expect(body).toEqual(FAILED);
    });

    test('500 when the API is unreachable', async () => {
        const { res, body } = await lookup('?term=brudd');

        expect(res.status).toBe(500);
        expect(body).toEqual(FAILED);
    });

    test('405 for other methods than GET', async () => {
        const { res, body, calls } = await lookup('?term=dagpenger', {
            method: 'POST',
        });

        expect(res.status).toBe(405);
        expect(res.headers.get('allow')).toBe('GET');
        expect(body).toEqual({ error: 'Method not allowed' });
        expect(calls).toEqual([]);
    });
});
