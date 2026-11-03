import { defineConfig } from 'vitest/config';

// .mts until package.json has "type": "module"
export default defineConfig({
    resolve: {
        // The imports through `paths` in tsconfig.json, e.g. 'utils/…'
        tsconfigPaths: true,
    },
    test: {
        // Not test/http, which has its own config: `pnpm run test:http`
        include: ['src/**/*.test.{ts,tsx}'],
        environment: 'jsdom',
        setupFiles: ['./src/vitest-setup.ts'],
        css: {
            // styles.foo is 'foo', so tests can look for class names
            modules: { classNameStrategy: 'non-scoped' },
        },
    },
});
