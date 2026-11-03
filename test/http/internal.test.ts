import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import {
    BASE,
    expectNoUnexpectedHosts,
    startServer,
    type TestServer,
} from './harness';

describe('internal endpoints', () => {
    let server: TestServer;

    beforeAll(async () => {
        server = await startServer();
    });

    afterAll(async () => {
        expectNoUnexpectedHosts(server);
        await server.stop();
    });

    test.each([
        ['isAlive', 'I am alive!'],
        ['isReady', 'I am ready!'],
    ])('%s', async (probe, message) => {
        const res = await server.fetch(`${BASE}/api/internal/${probe}`);

        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')?.split(';')[0]).toBe(
            'application/json'
        );
        expect(await res.json()).toEqual({ message });
    });

    test('metrics in the Prometheus text format', async () => {
        const res = await server.fetch(`${BASE}/api/internal/metrics`);

        expect(res.status).toBe(200);
        // Parameter order doesn't matter
        const contentType = res.headers.get('content-type') ?? '';
        expect(contentType.split(';')[0]).toBe('text/plain');
        expect(contentType).toContain('version=0.0.4');

        const body = await res.text();
        expect(body).toMatch(/^# TYPE navno_search_requests_total counter$/m);
        expect(body).toMatch(
            /^# TYPE navno_search_upstream_duration_seconds histogram$/m
        );
    });
});
