import { logAnalyticsEvent as logAnalyticsEventDecorator } from '@navikt/nav-dekoratoren-moduler';

const logAnalyticsEvent = (
    eventName: string,
    data?: Record<string, unknown>
): Promise<unknown> => {
    return logAnalyticsEventDecorator({
        eventName,
        origin: 'navno-search-frontend',
        eventData: data,
    });
};

export const logSearchQuery = (sokeord: string) =>
    logAnalyticsEvent('søk', {
        sokeord: '[redacted]',
        komponent: 'søkeside',
    });

export const logResultClick = (destinasjon: string, treffnr: number, sokeord?: string) =>
    logAnalyticsEvent('resultat-klikk', {
        destinasjon,
        sokeord: '[redacted]',
        treffnr,
    });

export const logFilterSelection = (filternavn: string, subFilter?: string) =>
    logAnalyticsEvent('filtervalg', {
        filternavn,
        subFilter,
    });

export const logShowMore = (page: number) => {
    logAnalyticsEvent('vis-flere-treff', { page });
};
