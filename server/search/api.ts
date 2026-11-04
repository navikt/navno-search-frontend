import { Hono } from 'hono';
import { NO_STORE } from '#server/document.ts';
import { parseParams } from './params.ts';
import { searchPage } from './upstream.ts';

// GET /sok/api/search: the page's own searches once it runs in the browser. One page of
// hits, with the page's params; no fallback to the unfiltered listing
export const searchApi = new Hono().get('/', parseParams, async (c) => {
	const { params } = c.req.valid('query');

	c.header('Cache-Control', NO_STORE);
	try {
		return c.json(await searchPage(params));
	} catch {
		// Logged and counted in upstream.ts
		return c.json({ error: 'Search failed' }, 502);
	}
});
