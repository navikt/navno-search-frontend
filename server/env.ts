import { z } from 'zod';

const schema = z.object({
	// navno-search-api's search endpoint
	SEARCH_URL: z.url(),
	// Where the page is served from, for its canonical and og: URLs
	APP_ORIGIN: z.url(),
	PORT: z.coerce.number().int().positive().default(3001),
});

const parsed = schema.safeParse(process.env);

// Read when the server starts, so a misconfigured pod crashes before it takes traffic
if (!parsed.success) {
	throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
