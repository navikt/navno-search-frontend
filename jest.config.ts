import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    modulePathIgnorePatterns: ['tests'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
    // @navikt/next-logger is ESM-only, which Jest can't load as CommonJS.
    // Tests only need to verify our own logging calls, so a manual mock
    // stands in for the real (pino-based) logger.
    moduleNameMapper: {
        '^@navikt/next-logger$': '<rootDir>/src/testHelpers/next-logger-mock.ts',
    },
};

const config = async () => {
    const fn = createJestConfig(customJestConfig);
    const res = await fn();

    return res;
};

export default config;
