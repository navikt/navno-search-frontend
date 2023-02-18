import React from 'react';
import type { AppProps } from 'next/app';

import 'global.scss';

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
