// Runs the build the way the image does, from dist/ and package.json with no node_modules, and requests a page,
// a client file and the probes. Catches a dependency that only breaks once it's bundled, which the unit tests,
// running from source, can't see. `pnpm build && pnpm test:dist`; CI runs it after the build

// node:test's test() returns a promise the runner tracks itself
/* oxlint-disable typescript/no-floating-promises */
import assert from 'node:assert/strict';
import { type ChildProcess, spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { searchResult } from '#test/fixtures.ts';

const STARTUP_TIMEOUT = 10_000;

let dir: string;
let upstream: Server;
let app: ChildProcess;
let output = '';
let origin: string;

const listen = async (server: Server) => {
	server.listen(0, '127.0.0.1');
	await once(server, 'listening');
	return (server.address() as AddressInfo).port;
};

// A port nothing is listening on, for the app
const freePort = async () => {
	const server = createServer();
	const port = await listen(server);
	server.close();
	return port;
};

const waitForListening = (child: ChildProcess) =>
	new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(`No "Listening" within ${STARTUP_TIMEOUT} ms`)), STARTUP_TIMEOUT);
		child.stdout?.on('data', () => {
			if (output.includes('Listening on port')) {
				clearTimeout(timer);
				resolve();
			}
		});
		child.on('exit', (code) => {
			clearTimeout(timer);
			reject(new Error(`The server exited with ${code}`));
		});
	});

const get = (path: string, headers: Record<string, string> = {}) =>
	// The page waits for the decorator, which outside a cluster comes from www.nav.no
	fetch(`${origin}${path}`, { headers, signal: AbortSignal.timeout(30_000) });

// The server's output, so a failure shows what it logged
const withOutput = (message: string) => `${message}\n--- server output ---\n${output}`;

before(async () => {
	// navno-search-api, answering every search with the fixture
	upstream = createServer((_, res) => {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(searchResult()));
	});
	const upstreamPort = await listen(upstream);

	dir = await mkdtemp(join(tmpdir(), 'navno-search-frontend-'));
	await cp('dist', join(dir, 'dist'), { recursive: true });
	await cp('package.json', join(dir, 'package.json'));

	const port = await freePort();
	origin = `http://127.0.0.1:${port}`;
	app = spawn(process.execPath, ['--enable-source-maps', 'dist/server/main.js'], {
		cwd: dir,
		env: {
			PATH: process.env.PATH,
			NODE_ENV: 'production',
			SEARCH_URL: `http://127.0.0.1:${upstreamPort}/content/search`,
			APP_ORIGIN: 'https://www.nav.test',
			PORT: String(port),
		},
	});
	const collect = (chunk: Buffer) => {
		output += chunk.toString();
	};
	app.stdout?.on('data', collect);
	app.stderr?.on('data', collect);
	await waitForListening(app).catch((e: unknown) => {
		throw new Error(withOutput(String(e)));
	});
});

after(async () => {
	if (app?.exitCode === null) {
		app.kill('SIGTERM');
		await once(app, 'exit');
	}
	upstream?.close();
	if (dir) {
		await rm(dir, { recursive: true, force: true });
	}
});

for (const probe of ['isAlive', 'isReady', 'metrics']) {
	test(`the ${probe} probe answers`, async () => {
		const res = await get(`/sok/api/internal/${probe}`);
		assert.equal(res.status, 200, withOutput(`${probe}: ${res.status}`));
	});
}

test('the search page renders the hits', async () => {
	const res = await get('/sok?ord=dagpenger');
	const html = await res.text();
	assert.equal(res.status, 200, withOutput(`/sok: ${res.status}`));
	assert.match(html, /Fyll ut meldekort – dagpenger/, withOutput('The page is missing a hit'));
	assert.match(html, /id="app-props"/, withOutput('The page is missing the props for hydration'));
});

test('the search API answers', async () => {
	const res = await get('/sok/api/search?ord=dagpenger');
	assert.equal(res.status, 200, withOutput(`/sok/api/search: ${res.status}`));
	assert.equal((await res.json()).word, 'dagpenger');
});

test('the client files are served precompressed', async () => {
	const manifest: Record<string, { file: string }> = JSON.parse(
		await readFile(join(dir, 'dist/client/.vite/manifest.json'), 'utf-8')
	);
	const script = manifest['client/main-client.tsx']?.file;
	assert.ok(script, 'client/main-client.tsx is missing from the manifest');
	const res = await get(`/sok/${script}`, { 'Accept-Encoding': 'br' });
	assert.equal(res.status, 200, withOutput(`/sok/${script}: ${res.status}`));
	assert.equal(res.headers.get('Content-Encoding'), 'br');
});

test('an unknown path gets the 404 page', async () => {
	const res = await get('/sok/finnes-ikke');
	assert.equal(res.status, 404, withOutput(`/sok/finnes-ikke: ${res.status}`));
	assert.match(await res.text(), /Fant ikke siden/);
});
