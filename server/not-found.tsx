import { BodyLong, Heading, Link } from '@navikt/ds-react';
import type { NotFoundHandler } from 'hono';
import { renderToStaticMarkup } from 'react-dom/server';
import { decoratorFor, NO_STORE, notFoundPage } from './document.ts';

const NotFound = () => (
	<div className="sok-not-found">
		<Heading level="1" size="large" spacing>
			Fant ikke siden
		</Heading>
		<BodyLong spacing>
			Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
		</BodyLong>
		<BodyLong>
			<Link href="/sok">Gå til søket</Link>
		</BodyLong>
	</div>
);

export const notFound: NotFoundHandler = async (c) => {
	const decorator = await decoratorFor();
	c.header('Cache-Control', NO_STORE);
	return c.html(notFoundPage(decorator, renderToStaticMarkup(<NotFound />)), 404);
};
