const PATHS = {
    xpSearchService: '/_/service/no.nav.navno/search',
    searchApi: `${process.env.APP_BASE_PATH}/api/search`,
    searchTips:
        '/no/nav-og-samfunn/kontakt-nav/teknisk-brukerstotte/nyttig-a-vite/soketips',
};

const URLS = {
    xpSearchService: `${process.env.XP_ORIGIN}${PATHS.xpSearchService}`,
};

const VARS = {};

export const Config = {
    PATHS,
    URLS,
    VARS,
};

export default Config;
