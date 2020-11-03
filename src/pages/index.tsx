import React from 'react';
import { GetServerSideProps } from 'next';
import { fetchSearchResults } from '../utils/fetch-search-result';
import { SearchResultProps } from '../types/search-result';
import SearchPage from '../components/SearchPage';
import { UndertekstBold } from 'nav-frontend-typografi';
import { paramsFromResult, searchParamsDefault } from '../types/search-params';
import AlertStripe from 'nav-frontend-alertstriper';
import Head from 'next/head';
import { ContextProvider } from '../context/ContextProvider';
import '../global-style.less';

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
                <div className={'content-wrapper'} id={'maincontent'}>
                    {process.env.APP_BASE_PATH !== '/sok' && (
                        <div className={'work-in-progress'}>
                            <UndertekstBold>
                                {
                                    'Denne versjonen av søk på nav.no er under utvikling.'
                                }
                            </UndertekstBold>
                        </div>
                    )}
                    {initialResult ? (
                        <SearchPage />
                    ) : (
                        <AlertStripe type={'feil'} form={'inline'}>
                            {'Ukjent feil - søketjenesten er ikke tilgjengelig'}
                        </AlertStripe>
                    )}
                </div>
            </div>
        </ContextProvider>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const result = await fetchSearchResults({
        ...searchParamsDefault,
        ...context.query,
    }).catch((err) => console.error(err));

    if (!result) {
        const resultWithoutQuery = await fetchSearchResults(
            searchParamsDefault
        ).catch((err) => console.error(err));
        return { props: { initialResult: resultWithoutQuery } };
    }

    return { props: { initialResult: result } };
};

export default SearchBase;
