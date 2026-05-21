import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
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
