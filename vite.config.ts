import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import devServer, { defaultOptions } from '@hono/vite-dev-server';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode, isSsrBuild }) => {
	// The server reads process.env, and Vite only exposes VITE_* by itself
	if (command === 'serve') {
		Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
	}

	return {
		base: '/sok/',
		appType: 'custom',
		server: { port: 3001, strictPort: true, open: '/sok' },
		// There's no index.html to find the client's dependencies in
		optimizeDeps: { entries: ['client/main-client.tsx'] },
		plugins: [
			react(),
			// In dev, Hono answers every request except Vite's own and the client files Vite serves
			devServer({
				entry: './server/app.ts',
				exclude: [/^\/sok\/@/, /\.map$/, ...defaultOptions.exclude],
				// Otherwise it appends its script to the compressed page; server/document.ts adds it instead
				injectClientScript: false,
			}),
			{
				// Compresses the client's files once, at maximum, instead of on every request. serveStatic in
				// server/app.ts sends these; hono/compress takes over if one is missing
				name: 'precompress',
				apply: () => command === 'build' && !isSsrBuild,
				writeBundle({ dir = '' }, bundle) {
					for (const file of Object.keys(bundle).filter((name) => /\.(js|css)$/.test(name))) {
						const path = join(dir, file);
						const source = readFileSync(path);
						writeFileSync(
							`${path}.br`,
							brotliCompressSync(source, { params: { [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY } })
						);
						writeFileSync(`${path}.gz`, gzipSync(source, { level: constants.Z_BEST_COMPRESSION }));
					}
				},
			},
		],
		// The server build bundles every dependency, so the image needs no node_modules: they cost about 1.1s at boot
		// and 35-50 MB per pod for Aksel and zod alone. The image scan can't see bundled packages, so the SBOM
		// comes from pnpm-lock.yaml instead (sbom-from-lockfile in the workflows)
		ssr: command === 'build' ? { noExternal: true } : undefined,
		// Otherwise React's development and production builds are both bundled, and picked between at runtime
		define: isSsrBuild ? { 'process.env.NODE_ENV': JSON.stringify('production') } : undefined,
		build: isSsrBuild
			? // No source map: node --enable-source-maps parses it at startup and holds on to it, about 35 MB per pod.
				// The bundle isn't minified, so stack traces into it still read fine
				{ outDir: 'dist/server' }
			: {
					outDir: 'dist/client',
					manifest: true,
					rolldownOptions: { input: ['client/styles.css', 'client/main-client.tsx'] },
				},
	};
});
