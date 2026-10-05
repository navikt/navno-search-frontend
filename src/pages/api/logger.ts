// Receives log statements shipped from the browser via the isomorphic
// `logger` from `@navikt/next-logger`, and writes them out server-side in
// the same structured JSON format used by server-side logs.
export { loggingRoute as default } from '@navikt/next-logger/pages';
