import { fileURLToPath } from 'node:url';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger, traceRoute } from '@navikt/navno-logger';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { routePath } from 'hono/route';
import { internal } from './internal.ts';
import { notFound } from './not-found.tsx';
import { searchApi } from './search/api.ts';
import { search } from './search/route.tsx';
import { searchUrl } from './search-url.ts';
import { BASE_PATH } from '#shared/search.ts';

// strict: false matches /sok/ as well as /sok
const app = new Hono({ strict: false });

// Make OTel in Nais work
app.use(async (c, next) => {
	await next();
	traceRoute(routePath(c));
});
app.use(compress());

const sok = app.basePath(BASE_PATH);
sok.route('/api/internal', internal);
sok.route('/api/search', searchApi);
sok.route('/api/search-url', searchUrl);

// In dev, Vite serves the client
if (import.meta.env.PROD) {
	sok.get(
		'/assets/*',
		serveStatic({
			root: fileURLToPath(import.meta.resolve('#dist/client')),
			// Vite will write compressed files, this directly uses them instead of compressing
			// Saves a boatload of server time
			precompressed: true,
			// serveStatic looks the file up by the whole path, the base path included
			rewriteRequestPath: (path) => path.slice(BASE_PATH.length),
			// The file names hold a hash of the content, so a file never changes
			onFound: (_, c) => {
				c.header('Cache-Control', 'public, max-age=31536000, immutable');
			},
		})
	);
}

sok.route('/', search);

app.notFound(notFound);

app.onError((err, c) => {
	logger.error('Request failed', { method: c.req.method, path: c.req.path }, err);
	return c.text('Internal Server Error', 500);
});

// Served by main.ts in production, and by Vite in dev
export default app;
