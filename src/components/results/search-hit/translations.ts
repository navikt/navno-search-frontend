import { Language } from '../../../types/search-result';

const translations = {
    no: {
        published: 'Publisert',
        lastModified: 'Sist endret',
        person: 'Privatperson',
        employer: 'Arbeidsgiver',
        provider: 'Samarbeidspartner',
    },
    nn: {
        published: 'Publisert',
        lastModified: 'Sist endra',
        person: 'Privatperson',
        employer: 'Arbeidsgivar',
        provider: 'Samarbeidspartnar',
    },
    en: {
        published: 'Published',
        lastModified: 'Last modified',
        person: 'Individuals',
        employer: 'Employers',
        provider: 'Partners',
    },
    se: {
        // Mangler et par oversettelser her.
        // Disse står på lista og vil bli tatt med i neste bestilling.
        published: 'Publisert',
        lastModified: 'Sist endret',
        person: 'Priváhtaolmmoš',
        employer: 'Bargoaddi',
        provider: 'Ovttasbargoguoibmi',
    },
};

export const getTranslations = (language: Language) => {
    return translations[language] || translations['no'];
};