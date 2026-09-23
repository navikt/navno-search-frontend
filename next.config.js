module.exports = {
    basePath: process.env.APP_BASE_PATH,
    env: {
        APP_BASE_PATH: process.env.APP_BASE_PATH,
        SEARCH_URL: process.env.SEARCH_URL,
    },
    // pino uses worker threads to load transports, which the bundler
    // otherwise tries (very slowly) to statically trace. Keeping these
    // packages external avoids that and lets them load natively at runtime.
    serverExternalPackages: [
        'pino',
        '@navikt/next-logger',
        '@navikt/pino-logger',
    ],
    sassOptions: {
        includePaths: [require('path').join(__dirname, 'src')],
    },
};
