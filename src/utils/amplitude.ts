import Config from 'config';
import { logAmplitudeEvent as logAmplitudeEventDecorator } from '@navikt/nav-dekoratoren-moduler';

const logAmplitudeEvent = (
    eventName: string,
    data?: Record<string, any>
): Promise<any> => {
    return logAmplitudeEventDecorator({
        eventName,
        origin: 'navno-search-frontend',
        eventData: data,
    });
};

export const logPageview = () => logAmplitudeEvent('sidevisning');

export const logSearchQuery = (searchTerm: string) =>
    logAmplitudeEvent('søk', {
        destinasjon: Config.URLS.xpSearchService,
        sokeord: searchTerm?.toLowerCase(),
        komponent: 'søkeside',
    });

export const logResultClick = (
    href: string,
    searchTerm?: string,
    hitIndex?: number
) =>
    logAmplitudeEvent('resultat-klikk', {
        destinasjon: href,
        sokeord: searchTerm?.toLowerCase(),
        treffnr: hitIndex,
    });

export const logFilterSelection = (filter: string, subFilter?: string) =>
    logAmplitudeEvent('filter-valg', {
        filter,
        subFilter,
    });
