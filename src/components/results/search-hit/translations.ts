import { Language } from '../../../types/search-result';

const translations = {
    no: {
        published: 'Publisert',
        lastModified: 'Oppdatert',
        person: 'Privatperson',
        employer: 'Arbeidsgiver',
        provider: 'Samarbeidspartner',
        provider_doctor: 'Lege, tannlege eller annen behandler',
        provider_municipality_employed:
            'Ansatt i kommunen eller fylkeskommunen',
        provider_optician: 'Optiker eller øyelege',
        provider_administrator: 'Bostyrer',
        provider_measures_organizer: 'Tiltaksarrangør',
        provider_aid_supplier: 'Hjelpemiddelformidler',
        provider_other: 'Andre samarbeidspartnere',
        other: 'Annet',
    },
    nn: {
        published: 'Publisert',
        lastModified: 'Oppdatert',
        person: 'Privatperson',
        employer: 'Arbeidsgivar',
        provider: 'Samarbeidspartnar',
        provider_doctor: 'Lege, tannlege eller annan behandlar',
        provider_municipality_employed:
            'Tilsett i kommunen eller fylkeskommunen',
        provider_optician: 'Optikar eller augelege',
        provider_administrator: 'Bostyrar',
        provider_measures_organizer: 'Tiltaksarrangør',
        provider_aid_supplier: 'Hjelpemiddelformidlar',
        provider_other: 'Andre samarbeidspartnarar',
        other: 'Anna',
    },
    en: {
        published: 'Published',
        lastModified: 'Updated',
        person: 'Individual',
        employer: 'Employer',
        provider: 'Partner',
        provider_doctor: 'Physician, dentist or other practitioner',
        provider_municipality_employed:
            'Employee of the municipality or county municipality',
        provider_optician: 'Optician or ophthalmologist',
        provider_administrator: 'Estate manager',
        provider_measures_organizer: 'Organizer of measures',
        provider_aid_supplier: 'Aid supplier',
        provider_other: 'Other providers',
        other: 'Other',
    },
    se: {
        // Mangler et par oversettelser her.
        // Disse står på lista og vil bli tatt med i neste bestilling.
        published: 'Publisert',
        lastModified: 'Oppdatert',
        person: 'Priváhtaolmmoš',
        employer: 'Bargoaddi',
        provider: 'Ovttasbargoguoibmi',
        other: 'Annet',
    },
};

export const getTranslations = (language: Language) => {
    return translations[language] || translations['no'];
};
