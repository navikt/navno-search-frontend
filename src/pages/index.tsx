import React from 'react';
import { GetServerSideProps } from 'next';
import { fetchSearchResults } from '../utils/fetch-search-result';
import { SearchResultProps } from '../types/search-result';
import SearchPage from '../components/SearchPage';
import { UndertekstBold } from 'nav-frontend-typografi';
import { searchParamsDefault } from '../types/search-params';
import AlertStripe from 'nav-frontend-alertstriper';
import Head from 'next/head';
import '../global-style.less';

type Props = {
    results: SearchResultProps;
};

const SearchBase = (props: Props) => {
    const { results } = props;

    return (
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
                {results ? (
                    <SearchPage {...results} />
                ) : (
                    <AlertStripe type={'feil'} form={'inline'}>
                        {'Ukjent feil - søketjenesten er ikke tilgjengelig'}
                    </AlertStripe>
                )}
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const results = await fetchSearchResults({
        ...searchParamsDefault,
        ...context.query,
    }).catch((err) => console.error(err));

    if (!results) {
        const resultsWithoutQuery = await fetchSearchResults(
            searchParamsDefault
        ).catch((err) => console.error(err));
        return { props: { results: resultsWithoutQuery } };
    }

    return { props: { results: results } };
};

export default SearchBase;
