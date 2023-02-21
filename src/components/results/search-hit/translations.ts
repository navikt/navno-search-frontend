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
        employer: 'Arbeidsgjevar',
        provider: 'Samarbeidspartnar',
    },
    en: {
        published: 'Published',
        lastModified: 'Last modified',
        person: 'Person',
        employer: 'Employer',
        provider: 'Provider',
    },
};

export const getTranslations = (language: Language) => {
    return translations[language] || translations['no'];
};