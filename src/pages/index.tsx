import React from 'react';
import { GetServerSideProps } from 'next';
import { fetchSearchResults } from '../utils/fetch-search-result';
import { SearchResultProps } from '../types/search-result';
import { HeadWithMetatags } from '../components/metatags/HeadWithMetatags';
import SearchPage from '../page/SearchPage';
import { UndertekstBold } from 'nav-frontend-typografi';
import '../global-style.less';

type Props = {
    results: SearchResultProps;
};

const SearchBase = (props: Props) => {
    const { results } = props;

    if (!results) {
        return <div>{'Unknown error'}</div>;
    }

    return (
        <div className={'app'}>
            <HeadWithMetatags
                title={'Søk'}
                description={'Søk på nav.no'}
                canonicalUrl={'https://www.nav.no/sok'}
            />
            <div className={'content-wrapper'} id={'maincontent'}>
                <div className={'work-in-progress'}>
                    <UndertekstBold>
                        {
                            'Obs: denne versjonen av søk på nav.no er under utvikling! :)'
                        }
                    </UndertekstBold>
                </div>
                <SearchPage {...results} />
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const results = await fetchSearchResults(context.query).catch((err) =>
        console.log(err)
    );

    if (!results) {
        const resultsWithoutQuery = await fetchSearchResults().catch((err) =>
            console.log(err)
        );
        return { props: { results: resultsWithoutQuery } };
    }

    return { props: { results: results } };
};

export default SearchBase;
