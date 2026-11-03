import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { fetchWithTimeout, objectToQueryString } from './fetch-utils';

describe('fetchWithTimeout', () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
        Response.json({ data: 'Foo bar' })
    );

    beforeAll(() => {
        vi.stubGlobal('fetch', fetchMock);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    test('should resolve with the response when the fetch request succeeds', async () => {
        const url = 'https://www.nav.no/fetch-mock';
        const timeout = 5000;

        const result = await fetchWithTimeout(url, timeout);
        const json = await result.json();

        expect(fetchMock).toHaveBeenCalledWith(url);
        expect(json).toEqual({ data: 'Foo bar' });
    });
});

describe('objectToQueryString', () => {
    test('returns the proper query string', () => {
        const params = {
            foo: 'bar',
            baz: 'qux',
        };

        const queryString = objectToQueryString(params);

        expect(queryString).toBe('?foo=bar&baz=qux');
    });

    test('returns an empty string when the params object is empty', () => {
        const params = {};

        const queryString = objectToQueryString(params);

        expect(queryString).toBe('');
    });

    test('returns an empty string when the params object is undefined', () => {
        const params = undefined;

        // @ts-expect-error Testing the behaviour when params is unexpectedly undefined
        const queryString = objectToQueryString(params);

        expect(queryString).toBe('');
    });
});
