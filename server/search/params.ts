import { getCookie } from 'hono/cookie';
import { validator } from 'hono/validator';
import { z } from 'zod';
import { DEFAULTS, MAX_PAGE, type SearchParams } from '#shared/search.ts';

const facet = z.enum([
	'privatperson',
	'arbeidsgiver',
	'samarbeidspartner',
	'presse',
	'statistikk',
	'analyser-og-forskning',
	'innhold-fra-fylker',
]);
// The decorator's contexts, which are facets too
const context = facet.extract(['privatperson', 'arbeidsgiver', 'samarbeidspartner']);
const language = z.enum(['nb', 'nn', 'en']);

// A value that doesn't fit falls back rather than failing the request. So does a param given more
// than once, which Hono passes as an array: ?page=3&page=4 is page 0, but ?ord=a&ord=b searches for a
const query = z.object({
	ord: z.preprocess((value) => (Array.isArray(value) ? value[0] : value), z.string()).catch(''),
	f: facet.optional().catch(undefined),
	// ?uf=a,b&uf=c is a, b and c
	uf: z
		.union([z.string(), z.array(z.string())])
		.transform((value) =>
			[value]
				.flat()
				.flatMap((uf) => uf.split(','))
				.filter(Boolean)
		)
		.catch([]),
	s: z.enum(['0', '1']).catch('0'),
	preferredLanguage: language.optional().catch(undefined),
	page: z.coerce
		.number()
		.int()
		.positive()
		.transform((page) => Math.min(page, MAX_PAGE))
		.catch(0),
});

const cookies = z.object({
	'decorator-context': context.optional().catch(undefined),
	'decorator-language': language.optional().catch(undefined),
});

// A search was made if the URL has any of the params above, even empty; tracking params like utm_* don't count
const searchKeys = Object.keys(query.shape);

// The decorator's context comes from ?f= alone, not its cookie, as on Next: one of its three,
// else privatperson
const decoratorContext = context.catch('privatperson');

export type PageQuery = {
	params: SearchParams;
	// Nothing searched for yet: the page shows no hits
	landing: boolean;
	context: z.infer<typeof context>;
};

export const parseParams = validator('query', (value, c): PageQuery => {
	const params = query.parse(value);
	const cookie = cookies.parse(getCookie(c));
	return {
		params: {
			...params,
			// An unknown facet gets the cookie's context instead, as on Next
			f: params.f ?? cookie['decorator-context'] ?? DEFAULTS.f,
			preferredLanguage: params.preferredLanguage ?? cookie['decorator-language'] ?? DEFAULTS.preferredLanguage,
		},
		landing: !searchKeys.some((key) => key in value),
		context: decoratorContext.parse(value.f),
	};
});
