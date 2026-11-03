# Copilot Instructions

The search page on nav.no (`/sok`): a Hono server that renders a React app, which the browser hydrates, deployed on NAIS.

## Stack

- Hono 4 on Node 24, React 19 rendered on the server and hydrated in the browser, pnpm
- NAV Design System (`@navikt/ds-react`, `@navikt/ds-css`)
- Vite for the dev server and both builds, Vitest for tests, oxfmt and oxlint

## Commands

- `pnpm dev` — dev server on port 3001
- `pnpm build` — client and server builds in `dist`
- `pnpm test` — unit tests
- `pnpm lint` — oxfmt, oxlint and TypeScript
- `pnpm run test:http` — rebuild, then the temporary black-box tests in `test/http` against the build

## Architecture

- `server/app.ts` — the Hono app: the page, `/sok/api/search` (the app's own searches), `/sok/api/search-url`, probes and metrics, the built assets, the 404 page
- `server/document.ts` — the whole document: decorator, meta tags, asset tags
- `server/search/` — the page and `/sok/api/search`: params from the URL and the decorator's cookies, and the upstream search
- `client/App.tsx` — the app both sides render; `client/main-client.tsx` hydrates it with the props the server put in `#app-props`
- `client/useSearch.ts` — the page's state: searches `/sok/api/search` in place and replaces the URL
- `client/search/` — the components
- `shared/` — what server and browser both use: the search params and the API's types
- `client/styles.css` — `@navikt/ds-css` and the page's own classes, prefixed `sok-`

## Conventions

- Norwegian UI text (bokmål)
- Use NAV design system components over custom HTML
- The page also works as one GET form with named controls, before hydration and without JavaScript
- Imports across directories go through package.json `imports` (`#server/…`, `#client/…`, `#shared/…`, `#test/…`), with the file extension
