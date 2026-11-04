import type { SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';
import { SearchPage, Unavailable } from './search/SearchPage.tsx';

// What the server renders the app with, and hands the browser in #app-props
export type AppProps = {
	// null when neither the search nor the fallback to the unfiltered listing answered
	result: SearchResult | null;
	params: SearchParams;
	landing: boolean;
};

export const App = ({ result, params, landing }: AppProps) =>
	result ? <SearchPage initial={{ result, params, landing }} /> : <Unavailable />;
