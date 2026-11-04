import { corgi, isAbortError } from '@itsy/corgi';
import { abortPrevious } from '@itsy/corgi/abort-previous';
import { useState } from 'react';
import { BASE_PATH, searchQuery, type SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';
import { trackSearch } from './analytics.ts';

export type Initial = {
	result: SearchResult;
	params: SearchParams;
	landing: boolean;
};

type State = Initial & {
	// A new search: the hits give way to a spinner
	loading: boolean;
	// "Vis flere treff"
	loadingMore: boolean;
	failed: boolean;
	// The first hit "Vis flere treff" added, which gets focus
	firstNew?: number;
};

// Unticks underfacets the page has no checkbox for, which would otherwise stick to every search:
// - "Kontor" is ticked, then a new search term has no hits there, so "Kontor" isn't in the result
// - /sok?f=presse&uf=kontor: Presse has no underfacets
const withShownUnderfacets = (params: SearchParams, result: SearchResult): SearchParams => {
	const facet = result.aggregations.fasetter.buckets.find((bucket) => bucket.key === params.f);
	const shown = new Set(facet?.underaggregeringer?.buckets.map((bucket) => bucket.key));
	return { ...params, uf: params.uf.filter((key) => shown.has(key)) };
};

// The page's state, searched in place as on Next: the URL follows along without adding history
export const useSearch = (initial: Initial) => {
	const [state, setState] = useState<State>(() => ({
		...initial,
		params: withShownUnderfacets(initial.params, initial.result),
		loading: false,
		loadingMore: false,
		failed: false,
	}));
	// The latest change wins: each search cancels the one before it
	const [api] = useState(() => corgi.create({ baseURL: BASE_PATH, plugins: [abortPrevious()] }));

	const run = async (params: SearchParams, more: boolean) => {
		setState((current) => ({ ...current, params, loading: !more, loadingMore: more, failed: false }));

		try {
			const page = await api.get<SearchResult>('/api/search', { query: params });
			const searched = withShownUnderfacets(params, page);
			setState((current) => ({
				params: searched,
				result: more ? { ...page, hits: [...current.result.hits, ...page.hits] } : page,
				landing: false,
				loading: false,
				loadingMore: false,
				failed: false,
				firstNew: more ? current.result.hits.length + 1 : undefined,
			}));
			window.history.replaceState(window.history.state, '', `${BASE_PATH}?${searchQuery(searched)}`);
			if (!more) {
				trackSearch();
			}
		} catch (e) {
			if (!isAbortError(e)) {
				setState((current) => ({ ...current, loading: false, loadingMore: false, failed: true }));
			}
		}
	};

	return {
		...state,
		// Typing doesn't search, but the next search includes it, same as a submitted form
		setOrd: (ord: string) => setState((current) => ({ ...current, params: { ...current.params, ord } })),
		search: (changes: Partial<SearchParams> = {}) => void run({ ...state.params, ...changes, page: 0 }, false),
		showMore: () => void run({ ...state.params, page: state.params.page + 1 }, true),
	};
};
