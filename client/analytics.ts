import type { AnalyticsParams, getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';

type Track = ReturnType<typeof getAnalyticsInstance>;
type EventName = AnalyticsParams['eventName'];

let track: Track | undefined;

// dekoratøren may not have set up analytics
// If the user hasn't consented it rejects instead of throwing, hence the await
async function trackEvent<TName extends EventName>(eventName: TName, eventData?: AnalyticsParams<TName>['eventData']) {
	try {
		await track?.(eventName, eventData);
	} catch {}
}

export const setAnalytics = (instance: Track) => {
	track = instance;
};

const REDACTED = '[redacted]';

export const trackSearch = () => {
	void trackEvent('søk', { sokeord: REDACTED, komponentId: 'søkeside' });
};

export const trackFilter = (filternavn: string, subFilter?: string) => {
	void trackEvent('filtervalg', { filternavn, subFilter });
};

export const trackResultClick = (destinasjon: string, treffnr: number) => {
	void trackEvent('resultat-klikk', { destinasjon, sokeord: REDACTED, treffnr });
};

export const trackShowMore = (page: number) => {
	void trackEvent('vis-flere-treff', { page });
};
