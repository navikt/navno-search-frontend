import { Hono } from 'hono';
import { renderToString } from 'react-dom/server';
import { App, type AppProps } from '#client/App.tsx';
import { decoratorFor, type DevEnv, NO_STORE, searchPage, toHtml } from '#server/document.ts';
import { parseParams } from './params.ts';
import { searchPages } from './upstream.ts';

// GET /sok
export const search = new Hono<DevEnv>().get('/', parseParams, async (c) => {
	const { params, landing, context } = c.req.valid('query');
	const [found, decorator] = await Promise.all([searchPages(params), decoratorFor(context)]);
	const props: AppProps = { result: found?.result ?? null, params: found?.params ?? params, landing };

	c.header('Cache-Control', NO_STORE);
	const content = renderToString(<App {...props} />);
	return c.html(await toHtml(c, searchPage(decorator, content, props)));
});
