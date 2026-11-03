import { corgi, isHttpError, isTimeoutError } from '@itsy/corgi';
import { withTimeout } from '@itsy/corgi/timeout';
import { logger } from '@navikt/pino-logger';
import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { env } from './env.ts';

const FAILED = { error: 'Failed to fetch search URL' };
const api = corgi.create({ plugins: [withTimeout(5000)] });

// The URL navno-search-api has for a search term: { url, title }, both null if it has none
export const searchUrl = new Hono()
	.get('/', async (c) => {
		const terms = c.req.queries('term') ?? [];
		if (terms.length !== 1 || !terms[0].trim()) {
			logger.warn('Invalid search-url term');
			return c.json({ error: 'A single non-empty term is required' }, 400);
		}

		const url = new URL('search-url', env.SEARCH_URL);

		try {
			const answer = await api.get(url.href, { query: { term: terms[0] }, responseType: 'json' });
			return c.json(answer);
		} catch (err) {
			// Only the status: an HttpError's message and url have the term
			if (isHttpError(err)) {
				logger.error({ status: err.status }, 'Failed to fetch search URL');
				return c.json(FAILED, err.status as ContentfulStatusCode);
			}
			logger.error(err, 'Failed to fetch search URL');
			return c.json(FAILED, isTimeoutError(err) ? 408 : 500);
		}
	})
	.all('/', (c) => c.json({ error: 'Method not allowed' }, 405, { Allow: 'GET' }));
