import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { trackSearch, setAnalytics } from './analytics.ts';
import { captureException, loadApm } from './apm.ts';
import { App, type AppProps } from './App.tsx';

// Before React hydrates, so it loads meanwhile. Errors reported before it has loaded wait for it
loadApm();

// The server rendered the app into <main> with these props
const props: AppProps = JSON.parse(document.querySelector('script#app-props')?.textContent ?? 'null');
const root = document.getElementById('maincontent');

setAnalytics(getAnalyticsInstance('navno-search-frontend'));

if (props && root) {
	// A results page, rather than the empty one before a search
	if (props.result && !props.landing && props.params.page === 0) {
		trackSearch();
	}

	hydrateRoot(
		root,
		<StrictMode>
			<App {...props} />
		</StrictMode>,
		{
			// Errors React recovers from, such as a hydration mismatch, after which it renders on the client instead.
			// Uncaught errors keep React's default: they become global errors, which APM picks up by itself
			onRecoverableError: (error, { componentStack }) => {
				captureException(error, { fingerprint: 'root.recoverable-error', context: { componentStack } });
				// Still in the console, where React's default handler prints them. As a warning: APM reports every
				// console.error, which would report it twice
				// oxlint-disable-next-line no-console
				console.warn(error);
			},
		}
	);
}
