d# Copilot Instructions

Next.js 16 (Pages Router) search frontend for nav.no, deployed on NAIS.

## Stack

- React 19, TypeScript 5.9, pnpm
- NAV Design System (`@navikt/ds-react` v7.40, `@navikt/ds-css`)
- SCSS modules for styling
- Jest + Testing Library for tests

## Commands

- `pnpm dev` — dev server on port 3001
- `pnpm build` — production build
- `pnpm test` — run tests with coverage
- `pnpm lint` — ESLint

## Architecture

- `src/pages/index.tsx` — SSR entry, fetches from search API via `getServerSideProps`
- `src/pages/api/search.ts` — BFF proxy to external search service
- `src/components/` — UI components (SearchPage, filters, input, results, sorting)
- `src/context/` — React context with reducer for client-side state
- `src/utils/` — fetch helpers, analytics, decorator utilities
- `src/types/` — TypeScript types for search params and results

## Conventions

- Norwegian UI text (bokmål)
- Use NAV design system components over custom HTML
- Client-side searches go through the local API proxy (`/sok/api/search`), not directly to the backend
