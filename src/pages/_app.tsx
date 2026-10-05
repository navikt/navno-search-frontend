import React from 'react';
import type { AppProps } from 'next/app';
import { configureLogger } from '@navikt/next-logger';

import '@navikt/ds-css';
import '../global.scss';

configureLogger({ basePath: process.env.APP_BASE_PATH });

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
