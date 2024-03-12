const PATHS = {
    searchApi: `${process.env.APP_BASE_PATH}/api/search`,
    searchTips:
        '/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/soketips',
    appBasePathProd: '/sok',
};

const URLS = {
    searchService: process.env.SEARCH_URL,
};

const VARS = {
    decoratorParams: {
        chatbot: true,
        feedback: true,
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
