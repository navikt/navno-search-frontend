import { endFetchMock, startFetchMock } from 'jest-utils';
import { fetchWithTimeout, objectToQueryString } from './fetch-utils';

// Save the original fetch function

describe('fetchWithTimeout', () => {
    beforeAll(() => {
        startFetchMock();
    });

    afterAll(() => {
        endFetchMock();
    });

    test('should resolve with the response when the fetch request succeeds', async () => {
        const url = 'https://www.nav.no/fetch-mock';
        const timeout = 5000;

        const result = await fetchWithTimeout(url, timeout);
        const json = await result.json();

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

        // @ts-expect-error
        const queryString = objectToQueryString(params);

        expect(queryString).toBe('');
    });
});
