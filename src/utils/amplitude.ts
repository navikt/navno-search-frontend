import Config from 'config';
import { logAmplitudeEvent as logAmplitudeEventDecorator } from '@navikt/nav-dekoratoren-moduler';

const moreThanSixNumbersRegex = /\d(?:[^A-Za-z]*\d+[^A-Za-z]*){5,}\d/g;

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

export const logSearchQuery = (word: string) =>
    logAmplitudeEvent('søk', {
        destinasjon: Config.URLS.searchService,
        sokeord: replaceLargeNumbers(word),
        komponent: 'søkeside',
    });

export const logResultClick = (word: string, hitIndex?: number) =>
    logAmplitudeEvent('resultat-klikk', {
        destinasjon: '[redacted]',
        sokeord: replaceLargeNumbers(word),
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

const replaceLargeNumbers = (text: String) => {
    return text.replaceAll(moreThanSixNumbersRegex, "[redacted]")
}