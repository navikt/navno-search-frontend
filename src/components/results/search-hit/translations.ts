import { Language } from '../../../types/search-result';

const translations = {
    no: {
        published: 'Publisert',
        lastModified: 'Oppdatert',
        privatperson: 'Privatperson',
        arbeidsgiver: 'Arbeidsgiver',
        samarbeidspartner: 'Samarbeidspartner',
        andre: 'Annet',
    },
    nn: {
        published: 'Publisert',
        lastModified: 'Oppdatert',
        privatperson: 'Privatperson',
        arbeidsgiver: 'Arbeidsgivar',
        samarbeidspartner: 'Samarbeidspartnar',
        andre: 'Anna',
    },
    en: {
        published: 'Published',
        lastModified: 'Updated',
        privatperson: 'Individuals',
        arbeidsgiver: 'Employers',
        samarbeidspartner: 'Partners',
        andre: 'Other',
    },
    se: {
        // Mangler et par oversettelser her.
        // Disse står på lista og vil bli tatt med i neste bestilling.
        published: 'Publisert',
        lastModified: 'Oppdatert',
        privatperson: 'Priváhtaolmmoš',
        arbeidsgiver: 'Bargoaddi',
        samarbeidspartner: 'Ovttasbargoguoibmi',
        andre: 'Annet',
    },
};

export const getTranslations = (language: Language) => {
    return translations[language] || translations['no'];
};
