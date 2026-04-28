import { getAnalyticsInstance, Events } from '@navikt/nav-dekoratoren-moduler';

const logAnalyticsEvent = getAnalyticsInstance('navno-search-frontend');

export const logSearchQuery = (_sokeord: string) =>
    logAnalyticsEvent(Events.SOK_NAVNO, {
        sokeord: '[redacted]',
        komponentId: 'søkeside',
    });

export const logResultClick = (
    destinasjon: string,
    treffnr: number,
    _sokeord?: string
) =>
    logAnalyticsEvent(Events.RESULTAT_KLIKK, {
        destinasjon,
        sokeord: '[redacted]',
        treffnr,
    });

export const logFilterSelection = (filternavn: string, subFilter?: string) =>
    logAnalyticsEvent(Events.FILTERVALG, {
        filternavn,
        subFilter,
    });

export const logShowMore = (page: number) =>
    logAnalyticsEvent(Events.VIS_FLERE_TREFF, { page });
