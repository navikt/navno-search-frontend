import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ContextProvider } from 'context/ContextProvider';
import { fetchSearchResults } from 'utils/fetch-search-result';
import { SearchResultProps } from 'types/search-result';
import SearchPage from 'components/SearchPage';
import { paramsFromResult, SearchParams } from 'types/search-params';
import { Alert } from '@navikt/ds-react';

type Props = {
    initialResult: SearchResultProps | null;
};

const SearchBase = (props: Props) => {
    const { initialResult } = props;

    return (
        <div className={'app'}>
            <Head>
                <title>{'Søk - nav.no'}</title>
            </Head>
            <main
                className={'content-wrapper'}
                id={'maincontent'}
                tabIndex={-1}
            >
                {initialResult?.fasettKey ? (
                    <ContextProvider
                        initialResult={initialResult}
                        initialParams={paramsFromResult(initialResult)}
                    >
                        <SearchPage />
                    </ContextProvider>
                ) : (
                    <Alert role="alert" variant="error">
                        {'Feil - søketjenesten er ikke tilgjengelig'}
                    </Alert>
                )}
            </main>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
    context
) => {
    const result = await fetchSearchResults(
        context.query as unknown as SearchParams
    ).catch((err) => {
        console.error(err);
        return null;
    });

    if (result) {
        return {
            props: { initialResult: { ...result, isInitialResult: true } },
        };
    }

    const resultWithoutQuery = await fetchSearchResults().catch((err) => {
        console.error(err);
        return null;
    });

    return { props: { initialResult: resultWithoutQuery } };
};

export default SearchBase;
