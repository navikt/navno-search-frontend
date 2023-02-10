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

// Prevents errors due to client-side imports of server-side only libraries
const resolveNodeLibsClientSide = (config, options) => {
    if (!options.isServer) {
        config.resolve.fallback = {
            buffer: false,
            fs: false,
            process: false,
        };
    }
};


module.exports = {
    basePath: process.env.APP_BASE_PATH,
    env: {
        APP_BASE_PATH: process.env.APP_BASE_PATH,
        XP_ORIGIN: process.env.XP_ORIGIN,
    },
    webpack: (config, options) => {
        cssModulesNoDashesInClassnames(config);
        resolveNodeLibsClientSide(config, options);

        const { webpack, buildId } = options;

        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.BUILD_ID': JSON.stringify(buildId),
            })
        );

        return config;
    },
};
