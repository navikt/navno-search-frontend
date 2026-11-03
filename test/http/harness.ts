import { spawn } from 'node:child_process';
import net from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { expect } from 'vitest';
import { SEARCH_HOST, startStub, type Stub, type StubRoute } from './stub';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));

// How the built server is started. This is the only line that should change
// when the server is ported; the tests must stay the same.
export const ENTRY = ['node_modules/next/dist/bin/next', 'start'];

export const BASE = '/sok';

// Next inlines SEARCH_URL into the build, so `pretest:http` in package.json
// must build with the same values
export const APP_ORIGIN = 'https://www.nav.test';

const defaultEnv = (): Record<string, string> => ({
    NODE_ENV: 'production',
    ENV: 'dev',
    APP_BASE_PATH: BASE,
    APP_ORIGIN,
    SEARCH_URL: `http://${SEARCH_HOST}/content/search`,
    // As in the pod, whatever the machine running the tests uses
    TZ: 'UTC',
});

export type TestServer = {
    baseUrl: string;
    stub: Stub;
    fetch: (path: string, init?: RequestInit) => Promise<Response>;
    output: () => string;
    stop: () => Promise<void>;
};

type Options = {
    // Merged over the defaults; undefined removes a variable
    env?: Record<string, string | undefined>;
    // Stub routes that take precedence over the defaults
    routes?: StubRoute[];
};

const freePort = () =>
    new Promise<number>((resolve, reject) => {
        const srv = net.createServer();
        srv.once('error', reject);
        srv.listen(0, '127.0.0.1', () => {
            const { port } = srv.address() as net.AddressInfo;
            srv.close(() => resolve(port));
        });
    });

const launch = async (
    stub: Stub,
    options: Options,
    attempt: number
): Promise<TestServer> => {
    const port = await freePort();
    const env: Record<string, string> = {};
    const merged = {
        ...defaultEnv(),
        ...options.env,
        PATH: process.env.PATH,
        PORT: String(port),
        STUB_ORIGIN: stub.origin,
    };
    for (const [key, value] of Object.entries(merged)) {
        if (value !== undefined) {
            env[key] = value;
        }
    }

    const preload = pathToFileURL(
        fileURLToPath(new URL('./preload.mts', import.meta.url))
    ).href;
    const child = spawn(process.execPath, ['--import', preload, ...ENTRY], {
        cwd: ROOT,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    child.stdout.on('data', (data) => (output += data));
    child.stderr.on('data', (data) => (output += data));

    let exited = false;
    const exitPromise = new Promise<void>((resolve) =>
        child.once('exit', () => {
            exited = true;
            resolve();
        })
    );

    const baseUrl = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 20_000;
    while (!exited) {
        const ready = await fetch(`${baseUrl}${BASE}/api/internal/isReady`)
            .then((res) => res.ok)
            .catch(() => false);
        if (ready) {
            break;
        }
        if (Date.now() > deadline) {
            child.kill('SIGKILL');
            throw new Error(
                `Server did not become ready within 20s:\n${output}`
            );
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (exited) {
        if (output.includes('EADDRINUSE') && attempt < 3) {
            return launch(stub, options, attempt + 1);
        }
        throw new Error(`Server exited during startup:\n${output}`);
    }

    const stop = async () => {
        if (!exited) {
            child.kill('SIGTERM');
            const timer = setTimeout(() => child.kill('SIGKILL'), 5_000);
            await exitPromise;
            clearTimeout(timer);
        }
        await stub.close();
    };

    return {
        baseUrl,
        stub,
        fetch: (path, init) =>
            fetch(`${baseUrl}${path}`, { redirect: 'manual', ...init }),
        output: () => output,
        stop,
    };
};

export const startServer = async (
    options: Options = {}
): Promise<TestServer> => {
    const stub = await startStub(options.routes);
    try {
        return await launch(stub, options, 1);
    } catch (e) {
        await stub.close();
        throw e;
    }
};

export const parseHtml = (html: string) => new JSDOM(html).window.document;

export const fetchPage = async (
    server: TestServer,
    path: string,
    init?: RequestInit
) => {
    const res = await server.fetch(path, init);
    return { res, doc: parseHtml(await res.text()) };
};

export const expectNoUnexpectedHosts = (server: TestServer) => {
    expect(
        server.stub.unexpected.map((r) => `${r.method} ${r.host}${r.path}`)
    ).toEqual([]);
};
