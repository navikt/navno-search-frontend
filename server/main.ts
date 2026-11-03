import { serve } from '@hono/node-server';
import { logger } from '@navikt/pino-logger';
import app from './app.ts';
import { env } from './env.ts';

const server = serve({ fetch: app.fetch, port: env.PORT }, () => {
	logger.info(`Listening on port ${env.PORT}`);
});

const shutdown = () => {
	logger.info('Shutting down');
	server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
