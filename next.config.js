const withLess = require('@zeit/next-less');
const packageJson = require('./package.json');

const navFrontendModuler = Object.keys(packageJson.dependencies).reduce(
    (acc, key) => (key.startsWith('nav-frontend-') ? acc.concat(key) : acc),
    []
);

const withTranspileModules = require('next-transpile-modules')([
    ...navFrontendModuler,
    '@navikt/nav-dekoratoren-moduler',
]);

const configWithAllTheThings = (config) =>
    withTranspileModules(withLess(config));

module.exports = configWithAllTheThings({
    basePath: process.env.APP_BASE_PATH,
    env: {
        APP_BASE_PATH: process.env.APP_BASE_PATH,
        XP_ORIGIN: process.env.XP_ORIGIN,
    },
    webpack5: false
});
