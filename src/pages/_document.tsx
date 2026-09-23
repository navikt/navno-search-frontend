import React from 'react';
import Document, {
    Html,
    Main,
    NextScript,
    DocumentContext,
    Head,
} from 'next/document';
import { logger } from '@navikt/next-logger';
import { getDecorator } from '../utils/fetch-decorator';
import { Config } from 'config';
import { DecoratorComponentsReact } from '@navikt/nav-dekoratoren-moduler/ssr';

type Props = {
    Decorator: DecoratorComponentsReact;
};

// Renders nothing. Used as a fallback for the decorator components if
// fetching the decorator fails, so the page can still render without
// a header/footer instead of crashing the entire SSR request.
const NoOpComponent = () => null;

const fallbackDecorator: DecoratorComponentsReact = {
    Scripts: NoOpComponent,
    Header: NoOpComponent,
    Footer: NoOpComponent,
    HeadAssets: NoOpComponent,
};

// Decorator will crash if invalid context ('privatperson', 'arbeidsgiver', 'samarbeidspartner') is passed.
// Also, if context is an array, we will default to 'privatperson' as the header can only indicate one single context.
const normalizeDecoratorContext = (context: string | string[]) => {
    if (Array.isArray(context)) {
        return 'privatperson';
    }
    if (
        context !== 'privatperson' &&
        context !== 'arbeidsgiver' &&
        context !== 'samarbeidspartner'
    ) {
        return 'privatperson';
    }
    return context;
};

class MyDocument extends Document<Props> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const context = ctx.query?.f ?? 'privatperson';
        const Decorator = await getDecorator(
            normalizeDecoratorContext(context)
        ).catch((err) => {
            logger.error(err, 'Failed to fetch decorator in _document');
            return fallbackDecorator;
        });

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
        const previewImg = `${appOrigin}/gfx/social-share-fallback.png`;
        const canonicalUrl = `${appOrigin}${appBasePathProd}`;

        return (
            <Html lang={'no'}>
                <Head>
                    <meta name="description" content={description}/>
                    <link rel={'canonical'} href={canonicalUrl}/>
                    <meta property={'og:title'} content={title}/>
                    <meta property={'og:site_name'} content={'nav.no'}/>
                    <meta property={'og:url'} content={canonicalUrl}/>
                    <meta property={'og:description'} content={description}/>
                    <meta property={'og:image'} content={previewImg}/>
                    <meta name="twitter:card" content={'summary_large_image'}/>
                    <meta name="twitter:domain" content={'nav.no'}/>
                    <meta name="twitter:title" content={title}/>
                    <meta name="twitter:description" content={description}/>
                    <meta name="twitter:image:src" content={previewImg}/>
                    <meta name="robots" content="noindex, nofollow"/>
                    <Decorator.HeadAssets/>
                </Head>
                <body>
                    <Decorator.Header/>
                    <Main/>
                    <Decorator.Footer/>
                    <Decorator.Scripts/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
