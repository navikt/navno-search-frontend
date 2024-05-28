import React from 'react';
import { BodyLong, Heading } from '@navikt/ds-react';
import { SearchResultProps } from '../../types/search-result';
import { quote } from '../../utils/quote';
import { isInitialDefaultQuery } from '../../utils/isInitialDefaultQuery';
import { useSearchContext } from '../../context/ContextProvider';
import style from './SearchSummary.module.scss';

type Props = {
    result: SearchResultProps;
};

export const SearchSummary = ({ result }: Props) => {
    const { word: searchTerm } = result;

    const [{ params }] = useSearchContext();

    let numHits = result.total;

    return (
        !isInitialDefaultQuery(result, params) && (
            <div className={style.searchSummary}>
                <Heading size="small" level="2">
                    {searchTerm
                        ? `${numHits} treff for ${quote(searchTerm)} med valgte søkefilter.`
                        : `${numHits} treff med valgte søkefilter.`}
                </Heading>
                <BodyLong>{'Endre søkefilter for å se andre treff.'}</BodyLong>
            </div>
        )
    );
};
