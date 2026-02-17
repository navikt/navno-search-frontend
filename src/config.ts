const appBasePath =
    process.env.APP_BASE_PATH ??
    (process.env.NODE_ENV === 'production' ? '/sok' : '');

const PATHS = {
    searchApi: `${appBasePath}/api/search`,
    searchTips: '/soketips',
    appBasePathProd: '/sok',
};

const URLS = {
    searchService: process.env.SEARCH_URL,
};

const VARS = {
    decoratorParams: {
        chatbot: true,
        breadcrumbs: [{ title: 'Søk', url: '/sok' }],
    },
    keys: {
        defaultFacet: 'privatperson',
        defaultPreferredLanguage: "nb",
    },
};

export const Config = {
    PATHS,
    URLS,
    VARS,
};

export default Config;
