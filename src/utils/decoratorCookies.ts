import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const validAudiences: ReadonlySet<string> = new Set([
    'privatperson',
    'arbeidsgiver',
    'samarbeidspartner',
]);

const validLanguages: ReadonlySet<string> = new Set(['nb', 'nn', 'en']);

export const getDecoratorAudienceIfValid = (cookies: NextApiRequestCookies) => {
    const decoratorAudience = cookies['decorator-context'];

    return decoratorAudience && validAudiences.has(decoratorAudience)
        ? decoratorAudience
        : undefined;
};

export function getDecoratorLanguageIfValid(cookies: NextApiRequestCookies) {
    const decoratorLanguage = cookies['decorator-language'];

    return decoratorLanguage && validLanguages.has(decoratorLanguage)
        ? decoratorLanguage
        : undefined;
}
