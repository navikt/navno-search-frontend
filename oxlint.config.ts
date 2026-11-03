import { defineConfig } from 'oxlint';

export default defineConfig({
	plugins: ['typescript', 'unicorn', 'oxc', 'react', 'jsx-a11y', 'vitest', 'promise'],
	categories: { correctness: 'error', suspicious: 'error', perf: 'error' },
	options: { reportUnusedDisableDirectives: 'warn', typeAware: true },
	// The temporary suite stays as it was written against Next, until it's deleted
	ignorePatterns: ['test/http/**'],
	rules: {
		'no-console': 'error',
		'typescript/no-explicit-any': 'error',
		// Under pedantic, and react/hooks misses hooks called from plain functions
		'react/rules-of-hooks': 'error',
		// It would flag the leading _ that marks a variable as unused
		'no-underscore-dangle': 'off',
		// The automatic JSX runtime needs no React in scope
		'react/react-in-jsx-scope': 'off',
		// It would make the spinner's role="status" an <output>
		'jsx-a11y/prefer-tag-over-role': 'off',
		// Test helpers stay next to the tests that use them
		'unicorn/consistent-function-scoping': 'off',
		// The implementations give the mocks their types
		'vitest/require-mock-type-parameters': 'off',
		// It would flag every deliberate cast, like document.activeElement as HTMLElement
		'typescript/no-unsafe-type-assertion': 'off',
	},
});
