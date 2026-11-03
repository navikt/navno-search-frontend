// Where the app is served, also in dev (vite.config.ts has it as base)
export const BASE_PATH = '/sok';

// What the page asks navno-search-api for: the same on the server and in the browser
export type SearchParams = {
	ord: string;
	f: string;
	uf: string[];
	s: '0' | '1';
	preferredLanguage: string;
	page: number;
};

export const DEFAULTS: SearchParams = { ord: '', f: 'privatperson', uf: [], s: '0', preferredLanguage: 'nb', page: 0 };

// "Vis flere treff" stops here. A page load asks for pages 0..page at once
export const MAX_PAGE = 9;

// The query string of the page's URL
export const searchQuery = (params: SearchParams) => {
	const query = new URLSearchParams({
		ord: params.ord,
		f: params.f,
		s: params.s,
		preferredLanguage: params.preferredLanguage,
		page: String(params.page),
	});
	for (const uf of params.uf) {
		query.append('uf', uf);
	}
	return query;
};
