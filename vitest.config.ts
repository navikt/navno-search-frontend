import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		env: {
			// server/env.ts checks these when it loads
			SEARCH_URL: 'http://navno-search-api.test/content/search',
			APP_ORIGIN: 'https://www.nav.test',
			// The logger writes to stdout, past Vitest
			LOG_LEVEL: 'silent',
		},
		projects: [
			{ extends: true, test: { name: 'server', include: ['server/**/*.test.{ts,tsx}'], environment: 'node' } },
			{
				extends: true,
				test: {
					name: 'client',
					include: ['client/**/*.test.{ts,tsx}'],
					environment: 'jsdom',
					setupFiles: ['./test/setup-client.ts'],
				},
			},
		],
	},
});
