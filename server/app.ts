import { fileURLToPath } from 'node:url';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from '@navikt/pino-logger';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { internal } from './internal.ts';
import { notFound } from './not-found.tsx';
import { searchApi } from './search/api.ts';
import { search } from './search/route.tsx';
import { searchUrl } from './search-url.ts';
import { BASE_PATH } from '#shared/search.ts';

// strict: false matches /sok/ as well as /sok
const app = new Hono({ strict: false });
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
	logger.error(err, `Unhandled error on ${c.req.path}`);
	return c.text('Internal Server Error', 500);
});

// Served by main.ts in production, and by Vite in dev
export default app;
