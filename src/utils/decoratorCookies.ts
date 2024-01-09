import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export const getDecoratorAudienceIfValid = (cookies: NextApiRequestCookies) => {
    const validAudiences = [
        'privatperson',
        'arbeidsgiver',
        'samarbeidspartner',
    ];

    const decoratorAudience = cookies['decorator-context'];

    return decoratorAudience && validAudiences.includes(decoratorAudience)
        ? decoratorAudience
        : undefined;
};

export function getDecoratorLanguageIfValid(cookies: NextApiRequestCookies) {
    const validLanguages = ['nb', 'nn', 'en'];

    const decoratorLanguage = cookies['decorator-context'];

    return decoratorLanguage && validLanguages.includes(decoratorLanguage)
        ? decoratorLanguage
        : undefined;
}
