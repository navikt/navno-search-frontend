import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Black-box tests against the built server. `pnpm run test:http` first
// rebuilds the app with a pinned env (`pretest:http`), so it must never be a
// part of `pnpm test`, which CI runs on the build it deploys. To rerun against
// the existing build: `pnpm exec vitest run --config test/http/vitest.config.mts`
export default defineConfig({
    root: fileURLToPath(new URL('../..', import.meta.url)),
    test: {
        include: ['test/http/**/*.test.ts'],
        hookTimeout: 30_000,
        testTimeout: 30_000,
    },
});
