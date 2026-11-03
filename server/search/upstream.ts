import { corgi, isHttpError } from '@itsy/corgi';
import { withTimeout } from '@itsy/corgi/timeout';
import { logger } from '@navikt/pino-logger';
import { env } from '#server/env.ts';
import { searches, upstreamDuration } from '#server/metrics.ts';
import { DEFAULTS, type SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';

const FIVE_SECONDS = 5000;

const api = corgi.create({ plugins: [withTimeout(FIVE_SECONDS)] });

const fetchPage = async (params: SearchParams, page: number): Promise<SearchResult> => {
	const stopTimer = upstreamDuration.startTimer();
	try {
		const result = await api.get<SearchResult>(env.SEARCH_URL, {
			query: {
				ord: params.ord,
				f: params.f,
				// ['informasjon', 'kontor'] → 'informasjon,kontor', [] → left out
				uf: params.uf.length > 0 ? params.uf.join(',') : undefined,
				s: params.s,
				preferredLanguage: params.preferredLanguage,
				page,
			},
			responseType: 'json',
		});
		stopTimer({ status: 'success' });
		return result;
	} catch (e) {
		stopTimer({ status: 'error' });
		// HttpError → { status: 500 }, its message includes search terms
		// Others → { error: 'TimeoutError: Request timed out after 5000ms' }
		const reason = isHttpError(e) ? { status: e.status } : { error: String(e) };
		logger.error({ ...reason, facet: params.f, page }, 'Search failed');
		throw e;
	}
};

// Fetches pages in parallel and merges them into one result, the metrics will count this as one search:
// search({ ...params, page: 2 }, 0) → { ...page2, hits: [...page0.hits, ...page1.hits, ...page2.hits] }
const search = async (params: SearchParams, from: number): Promise<SearchResult> => {
	try {
		const pages = await Promise.all(
			Array.from({ length: params.page - from + 1 }, (_, i) => fetchPage(params, from + i))
		);
		searches.inc({ status: 'success' });
		return { ...pages[pages.length - 1], hits: pages.flatMap((page) => page.hits) };
	} catch (e) {
		searches.inc({ status: 'error' });
		throw e;
	}
};

// Runs the search for a page load, and falls back to the unfiltered listing:
//   /sok?ord=dagpenger&page=2 → { result: pages 0 to 2, params }
//   if that fails → { result: the unfiltered listing, params: DEFAULTS }
//   if that fails too → null
export const searchPages = async (
	params: SearchParams
): Promise<{ result: SearchResult; params: SearchParams } | null> => {
	for (const attempt of [params, DEFAULTS]) {
		try {
			// DEFAULTS are only searched if params fail, so this can't run in parallel
			// oxlint-disable-next-line no-await-in-loop
			return { result: await search(attempt, 0), params: attempt };
		} catch {
			// fetchPage has logged the error, and search has counted it
		}
	}
	return null;
};

// Runs the search for the browser, which asks for one page at a time:
//   /sok/api/search?ord=dagpenger&page=2 → page 2
export const searchPage = (params: SearchParams) => search(params, params.page);
