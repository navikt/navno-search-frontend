module.exports = {
    basePath: process.env.APP_BASE_PATH,
    env: {
        APP_BASE_PATH: process.env.APP_BASE_PATH,
        SEARCH_URL: process.env.SEARCH_URL,
    },
    sassOptions: {
        includePaths: [require('path').join(__dirname, 'src')],
    },
};
