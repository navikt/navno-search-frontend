// Remove dashes from js variable names for classnames generated from CSS-modules
// Enables all CSS-classes to be accessed from javascript with dot-notation
const cssModulesNoDashesInClassnames = (config) => {
    const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        .oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
            if (/css-loader([\/\\])(cjs|dist|src)/.test(moduleLoader.loader)) {
                if (typeof moduleLoader.options.modules === 'object') {
                    moduleLoader.options.modules = {
                        ...moduleLoader.options.modules,
                        exportLocalsConvention: 'dashesOnly',
                    };
                }
            }
        });
    });
};

const appBasePath =
    process.env.APP_BASE_PATH ??
    (process.env.NODE_ENV === 'production' ? '/sok' : '');

module.exports = {
    basePath: appBasePath,
    env: {
        APP_BASE_PATH: appBasePath,
        SEARCH_URL: process.env.SEARCH_URL,
    },
    webpack: (config) => {
        cssModulesNoDashesInClassnames(config);
        return config;
    },
};
