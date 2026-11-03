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
				// A server-only module rendered the page the browser shows, so an edit needs a reload.
				// The app's components hot-reload in the browser instead (devServer's own reload,
				// handleHotUpdate, doesn't fire for server modules in Vite 8)
				name: 'reload-on-server-edit',
				hotUpdate({ file, modules, server }) {
					const inClient = server.environments.client.moduleGraph.getModulesByFile(file)?.size;
					if (this.environment.name === 'ssr' && modules.length > 0 && !inClient) {
						server.environments.client.hot.send({ type: 'full-reload' });
					}
				},
			},
		],
		build: isSsrBuild
			? // Dependencies stay external: the image has node_modules
				{ outDir: 'dist/server' }
			: {
					outDir: 'dist/client',
					manifest: true,
					rolldownOptions: { input: ['client/styles.css', 'client/main-client.tsx'] },
				},
	};
});
