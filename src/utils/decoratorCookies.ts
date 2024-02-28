import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export const getDecoratorAudienceIfValid = (cookies: NextApiRequestCookies) => {
    const validAudiences: { [key: string]: string }  = {
        privatperson: '0',
        arbeidsgiver: '1',
        samarbeidspartner: '2',
    };

    const decoratorAudience = cookies['decorator-context'];

    return decoratorAudience && decoratorAudience in validAudiences
        ? validAudiences[decoratorAudience]
        : undefined;
};

export function getDecoratorLanguageIfValid(cookies: NextApiRequestCookies) {
    const validLanguages = ['nb', 'nn', 'en'];

    const decoratorLanguage = cookies['decorator-language'];

    return decoratorLanguage && validLanguages.includes(decoratorLanguage)
        ? decoratorLanguage
        : undefined;
}
