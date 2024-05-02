const PATHS = {
    searchApi: `${process.env.APP_BASE_PATH}/api/search`,
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
