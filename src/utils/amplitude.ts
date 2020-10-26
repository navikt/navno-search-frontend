// Prevents crash during SSR (amplitude-js is only for use in browsers)
const amplitude =
    typeof window !== 'undefined' ? require('amplitude-js') : () => null;

const logAmplitudeEvent = (eventName: string, data?: any): Promise<any> => {
    return new Promise(function (resolve: any) {
        const eventData = data || {};
        eventData.origin = 'navno-search-frontend';
        eventData.originVersion = 'unknown';
        amplitude?.getInstance().logEvent(eventName, eventData, resolve);
    });
};

export const initAmplitude = () => {
    amplitude?.getInstance().init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        includeUtm: true,
        includeReferrer: true,
        platform: window.location.toString(),
    });
};

export const logPageview = () => logAmplitudeEvent('sidevisning');

export const logSearchQuery = (searchTerm: string) =>
    logAmplitudeEvent('søk', { sokeOrd: searchTerm });

export const logResultClick = (href: string, searchTerm: string | undefined) =>
    logAmplitudeEvent('resultat-klikk', {
        destinasjon: href,
        sokeOrd: searchTerm,
    });

export const logFilterSelection = (filter: string, subFilter?: string) =>
    logAmplitudeEvent('filter-valg', {
        filter,
        subFilter,
    });
