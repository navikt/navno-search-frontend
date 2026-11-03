import { defineConfig } from 'oxfmt';

export default defineConfig({
	useTabs: true,
	tabWidth: 2,
	printWidth: 120,
	trailingComma: 'es5',
	semi: true,
	singleQuote: true,
	endOfLine: 'lf',
	// Leaves the markup in @itsy/html templates alone
	embeddedLanguageFormatting: 'off',
	ignorePatterns: [
		'.nais/config.yml',
		'wcag-rapport.json',
		// The temporary suite stays as it was written against Next, until it's deleted
		'test/http/**',
	],
});
