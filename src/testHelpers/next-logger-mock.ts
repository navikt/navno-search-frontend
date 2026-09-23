// Jest manual mock for @navikt/next-logger. The real package is ESM-only
// (no CommonJS build), which Jest's CJS-based test runner cannot load even
// with `transformIgnorePatterns` adjusted. Since tests only need to assert
// that our own code calls the logger correctly (not that pino itself works),
// a lightweight stub is sufficient here.
export const logger = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
};

export const configureLogger = jest.fn();
