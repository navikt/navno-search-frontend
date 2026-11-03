import { readFileSync } from 'node:fs';
import { raw } from '@itsy/html';
import { frame, type ElementEntry } from '@itsy/html/frame';
import { json } from '@itsy/html/util';
import {
	fetchDecoratorHtml,
	type DecoratorElements,
	type DecoratorParams,
} from '@navikt/nav-dekoratoren-moduler/ssr/index.js';
import type { Context } from 'hono';
import type { ViteDevServer } from 'vite';
import { env } from './env.ts';

// Inherited from the prior implementation
export const NO_STORE = 'private, no-cache, no-store, max-age=0, must-revalidate';

// 'prod' everywhere: in a cluster the module reaches the decorator through service discovery,
// in dev as in prod, and elsewhere it uses www.nav.no/dekoratoren
export const decoratorFor = (context: DecoratorParams['context'] = 'privatperson') =>
	fetchDecoratorHtml({
		env: 'prod',
		params: {
			context,
			chatbot: true,
			breadcrumbs: [{ title: 'Søk', url: '/sok' }],
		},
	});

type Assets = { styles: ElementEntry[]; scripts: ElementEntry[] };

const { BASE_URL } = import.meta.env;

// Vite serves the client's source in dev
// toHtml adds Vite's own client and the base path
const devAssets = (): Assets => ({
	styles: [{ tag: 'link', attrs: { rel: 'stylesheet', href: '/client/styles.css' } }],
	scripts: [{ tag: 'script', attrs: { type: 'module', src: '/client/main-client.tsx' } }],
});

// The client build's files, from its manifest: read once, so the server doesn't
// start without them
const builtAssets = (): Assets => {
	const manifest: Record<string, { file: string } | undefined> = JSON.parse(
		readFileSync(new URL(import.meta.resolve('#dist/client/.vite/manifest.json')), 'utf-8')
	);
	const url = (entry: string) => {
		const chunk = manifest[entry];
		if (!chunk) {
			throw new Error(`${entry} is missing from the client build's manifest`);
		}
		return `${BASE_URL}${chunk.file}`;
	};
	return {
		styles: [{ tag: 'link', attrs: { rel: 'stylesheet', href: url('client/styles.css') } }],
		scripts: [{ tag: 'script', attrs: { type: 'module', src: url('client/main-client.tsx') } }],
	};
};

const assets = import.meta.env.DEV ? devAssets() : builtAssets();

type Page = {
	title: string;
	description?: string;
	head?: ElementEntry[];
	decorator: DecoratorElements;
	// Markup for <main>: the server-rendered app
	content: string;
	props?: unknown;
};

const page = ({ title, description, head = [], decorator, content, props }: Page) =>
	frame({
		lang: 'no',
		title,
		description,
		head: [...head, raw(decorator.DECORATOR_HEAD_ASSETS), ...assets.styles],
		header: raw(decorator.DECORATOR_HEADER),
		content: raw(content),
		footer: raw(decorator.DECORATOR_FOOTER),
		scripts: [
			raw(decorator.DECORATOR_SCRIPTS),
			...(props === undefined ? [] : [json(props, { id: 'app-props' }), ...assets.scripts]),
		],
		attrs: { main: { class: 'sok-main' } },
	}).markup;

// @hono/vite-dev-server hands the handlers Vite's dev server
export type DevEnv = { Bindings: { vite?: ViteDevServer } };

// Vite dev things
export const toHtml = (c: Context<DevEnv>, markup: string): string | Promise<string> => {
	const vite = c.env?.vite;
	if (!import.meta.env.DEV || !vite) {
		return markup;
	}
	const { pathname, search } = new URL(c.req.url);
	// Vite's HTML parser objects to the decorator's </link> end tags, which browsers ignore
	return vite.transformIndexHtml(`${pathname}${search}`, markup.replace(/<\/link>/gi, ''));
};

const SEARCH_TITLE = 'Søk - nav.no';
const SEARCH_DESCRIPTION = 'Søk på hele nav.no. Du kan filtrere på innhold og dato.';
const canonical = `${env.APP_ORIGIN}/sok`;
// The nav.no frontend's, not this app's
const image = `${env.APP_ORIGIN}/gfx/social-share-fallback.png`;
const noindex: ElementEntry = { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } };

const searchHead: ElementEntry[] = [
	{ tag: 'link', attrs: { rel: 'canonical', href: canonical } },
	{ tag: 'meta', attrs: { property: 'og:title', content: SEARCH_TITLE } },
	{ tag: 'meta', attrs: { property: 'og:site_name', content: 'nav.no' } },
	{ tag: 'meta', attrs: { property: 'og:url', content: canonical } },
	{ tag: 'meta', attrs: { property: 'og:description', content: SEARCH_DESCRIPTION } },
	{ tag: 'meta', attrs: { property: 'og:image', content: image } },
	{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
	{ tag: 'meta', attrs: { name: 'twitter:domain', content: 'nav.no' } },
	{ tag: 'meta', attrs: { name: 'twitter:title', content: SEARCH_TITLE } },
	{ tag: 'meta', attrs: { name: 'twitter:description', content: SEARCH_DESCRIPTION } },
	{ tag: 'meta', attrs: { name: 'twitter:image:src', content: image } },
	noindex,
];

export const searchPage = (decorator: DecoratorElements, content: string, props: unknown) =>
	page({ title: SEARCH_TITLE, description: SEARCH_DESCRIPTION, head: searchHead, decorator, content, props });

export const notFoundPage = (decorator: DecoratorElements, content: string) =>
	page({ title: 'Fant ikke siden - nav.no', head: [noindex], decorator, content });
