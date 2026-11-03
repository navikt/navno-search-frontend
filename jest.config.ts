import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    // test/http is the black-box suite, run by Vitest with `pnpm run test:http`
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    modulePathIgnorePatterns: ['tests'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
};

const config = async () => {
    const fn = createJestConfig(customJestConfig);
    const res = await fn();

    return res;
};

export default config;
