import Config from "config";
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

export const logPageview = () => {
    logAmplitudeEvent('sidevisning');
    umami.track('besøk');
}

export const logSearchQuery = (sokeord: string) => {
    logAmplitudeEvent('søk', {
        destinasjon: Config.URLS.searchService,
        sokeord: '[redacted]',
        komponent: 'søkeside',
    });
    umami.track('søk', {
        sokeord,
        komponent: 'søkeside',
    });
}
export const logResultClick = (destinasjon: string, treffnr: number, sokeord?: string) => {
    logAmplitudeEvent('resultat-klikk', {
        destinasjon,
        sokeord: '[redacted]',
        treffnr,
    });
    umami.track('resultat-klikk', {
        destinasjon,
        sokeord,
        treffnr,
    })
}

export const logFilterSelection = (filter: string, subFilter?: string) =>
    logAmplitudeEvent('filter-valg', {
        filter,
        subFilter,
    });

export const logShowMore = (page: number) => {
    logAmplitudeEvent('vis-flere-treff', { page });
};
