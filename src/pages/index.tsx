import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ContextProvider } from 'context/ContextProvider';
import { fetchSearchResults } from 'utils/fetch-search-result';
import { SearchResultProps } from 'types/search-result';
import SearchPage from 'components/SearchPage';
import { paramsFromResult } from 'types/search-params';
import { Alert } from '@navikt/ds-react';

import 'global.scss';

type Props = {
    initialResult: SearchResultProps;
};

const SearchBase = (props: Props) => {
    const { initialResult } = props;

    return (
        <ContextProvider
            initialResult={initialResult}
            initialParams={paramsFromResult(initialResult)}
        >
            <div className={'app'}>
                <Head>
                    <title>{'Søk - nav.no'}</title>
                </Head>
                <main
                    role={'main'}
                    className={'content-wrapper'}
                    id={'maincontent'}
                    tabIndex={-1}
                >
                    {initialResult?.fasettKey ? (
                        <SearchPage />
                    ) : (
                        <Alert variant="error">
                            {'Feil - søketjenesten er ikke tilgjengelig'}
                        </Alert>
                    )}
                </main>
            </div>
        </ContextProvider>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const result = await fetchSearchResults(context.query).catch((err) =>
        console.error(err)
    );

    if (!result) {
        const resultWithoutQuery = await fetchSearchResults().catch((err) =>
            console.error(err)
        );
        return { props: { initialResult: resultWithoutQuery || null } };
    }

    return { props: { initialResult: result || null } };
};

export default SearchBase;
