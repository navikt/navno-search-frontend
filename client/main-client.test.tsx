import { json } from '@itsy/html/util';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { DEFAULTS } from '#shared/search.ts';
import { installMockFetch } from '#test/fetch.ts';
import { searchResult } from '#test/fixtures.ts';
import type { AppProps } from './App.tsx';
import { App } from './App.tsx';

const { log } = vi.hoisted(() => ({ log: vi.fn(() => Promise.resolve()) }));

vi.mock('@navikt/nav-dekoratoren-moduler', () => ({ getAnalyticsInstance: () => log }));

const http = installMockFetch();

beforeEach(() => {
	http.get('/sok/api/search', { json: searchResult() });
	vi.resetModules();
});

afterEach(() => {
	log.mockClear();
	document.body.innerHTML = '';
});

// The page as the server sends it, then the script as the browser runs it
const load = async (props: AppProps) => {
	document.body.innerHTML = `<main id="maincontent">${renderToString(<App {...props} />)}</main>${json(props, { id: 'app-props' }).markup}`;
	// hydrateRoot schedules its work; flush it so it can't run after the test (and jsdom) is gone
	await act(async () => {
		await import('./main-client.tsx');
	});
};

describe('main-client', () => {
	test('logs the search of a results page, and hydrates it', async () => {
		await load({ result: searchResult(), params: { ...DEFAULTS, ord: 'dagpenger' }, landing: false });

		expect(log.mock.calls).toEqual([['søk', { sokeord: '[redacted]', komponentId: 'søkeside' }]]);

		await userEvent.setup().click(await screen.findByRole('radio', { name: 'Presse' }));

		await waitFor(() => expect(http.calls).toHaveLength(1));
	});

	test.each<[string, AppProps]>([
		['before a search', { result: searchResult(), params: DEFAULTS, landing: true }],
		[
			'for a page "Vis flere treff" loaded',
			{ result: searchResult(), params: { ...DEFAULTS, page: 2 }, landing: false },
		],
		['when the search service is down', { result: null, params: DEFAULTS, landing: false }],
	])('logs no search %s', async (_, props) => {
		await load(props);

		expect(log).not.toHaveBeenCalled();
	});
});
