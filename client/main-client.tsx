import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { trackSearch, setAnalytics } from './analytics.ts';
import { App, type AppProps } from './App.tsx';

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
		</StrictMode>
	);
}
