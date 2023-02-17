const PATHS = {
    xpSearchService: '/_/service/navno.nav.no.search/search',
    searchApi: `${process.env.APP_BASE_PATH}/api/search`,
    searchTips:
        '/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/soketips',
    appBasePathProd: '/sok',
};

const URLS = {
    xpSearchService: `${process.env.XP_ORIGIN}${PATHS.xpSearchService}`,
};

const VARS = {
    decoratorParams: {
        chatbot: true,
        feedback: true,
        breadcrumbs: [{ title: 'Søk', url: '/sok' }],
    },
    keys: {
        defaultFacet: '0',
        newsFacet: '1',
        defaultDateRange: -1,
    },
};

export const Config = {
    PATHS,
    URLS,
    VARS,
};

export default Config;
