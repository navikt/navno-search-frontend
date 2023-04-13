import React from 'react';
import Document, {
    Html,
    Main,
    NextScript,
    DocumentContext,
    Head,
} from 'next/document';
import { getDecorator } from '../utils/fetch-decorator';
import { Config } from 'config';
import { DecoratorComponents } from '@navikt/nav-dekoratoren-moduler/ssr';

type Props = {
    Decorator: DecoratorComponents;
};

class MyDocument extends Document<Props> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const Decorator = await getDecorator();
        return {
            ...initialProps,
            Decorator,
        };
    }

    render() {
        const { APP_ORIGIN: appOrigin } = process.env;
        const { appBasePathProd } = Config.PATHS;
        const { Decorator } = this.props;
        const title = 'Søk - nav.no';
        const description =
            'Søk på hele nav.no. Du kan filtrere på innhold og dato.';
        const previewImg = '/gfx/social-share-fallback.png';
        const canonicalUrl = `${appOrigin}${appBasePathProd}`;

        return (
            <Html lang={'no'}>
                <Head>
                    <meta name="description" content={description} />
                    <link rel={'canonical'} href={canonicalUrl} />
                    <meta property={'og:title'} content={title} />
                    <meta property={'og:site_name'} content={'nav.no'} />
                    <meta property={'og:url'} content={canonicalUrl} />
                    <meta property={'og:description'} content={description} />
                    <meta property={'og:image'} content={previewImg} />
                    <meta name="twitter:card" content={'summary_large_image'} />
                    <meta name="twitter:domain" content={'nav.no'} />
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image:src" content={previewImg} />
                    <meta name="robots" content="noindex, nofollow" />
                    <Decorator.Styles />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
