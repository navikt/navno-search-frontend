import { NextApiRequestCookies } from 'next/dist/server/api-utils';

const validAudiences: { [key: string]: string } = {
    privatperson: '0',
    arbeidsgiver: '1',
    samarbeidspartner: '2',
};

const validLanguages = ['nb', 'nn', 'en'];

export const getDecoratorAudienceIfValid = (cookies: NextApiRequestCookies) => {
    const decoratorAudience = cookies['decorator-context'];

    return decoratorAudience ? validAudiences[decoratorAudience] : undefined;
};

export function getDecoratorLanguageIfValid(cookies: NextApiRequestCookies) {
    const decoratorLanguage = cookies['decorator-language'];

    return decoratorLanguage && validLanguages.includes(decoratorLanguage)
        ? decoratorLanguage
        : undefined;
}
