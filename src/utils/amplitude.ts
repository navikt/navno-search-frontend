import Config from 'config';
import { logAmplitudeEvent as logAmplitudeEventDecorator } from '@navikt/nav-dekoratoren-moduler';

const logAmplitudeEvent = (
    eventName: string,
    data?: Record<string, unknown>
): Promise<unknown> => {
    return logAmplitudeEventDecorator({
        eventName,
        origin: 'navno-search-frontend',
        eventData: data,
    });
};

export const logPageview = () => logAmplitudeEvent('sidevisning');

export const logSearchQuery = () =>
    logAmplitudeEvent('søk', {
        destinasjon: Config.URLS.searchService,
        sokeord: '[redacted]',
        komponent: 'søkeside',
    });

export const logResultClick = (hitIndex?: number) =>
    logAmplitudeEvent('resultat-klikk', {
        destinasjon: '[redacted]',
        sokeord: '[redacted]',
        treffnr: hitIndex,
    });

export const logFilterSelection = (filter: string, subFilter?: string) =>
    logAmplitudeEvent('filter-valg', {
        filter,
        subFilter,
    });

export const logShowMore = (page: number) => {
    logAmplitudeEvent('vis-flere-treff', { page });
};
