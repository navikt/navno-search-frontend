import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { Config } from 'config';
import { useSearchContext } from 'context/ContextProvider';
import { SearchParams } from '../../types/search-params';
import { SearchResultsList } from './search-results-list/SearchResultsList';
import { SearchResultsEmpty } from './search-results-empty/SearchResultsEmpty';

import style from './SearchResults.module.scss';

const { keys } = Config.VARS;

const isInitialDefaultQuery = (
    result: SearchResultProps,
    params: SearchParams
) => {
    const { word: searchTerm, isInitialResult } = result;
    const { f, uf } = params;

    return (
        !searchTerm &&
        isInitialResult &&
        f === keys.defaultFacet &&
        uf.length === 0
    );
};

type Props = {
    result: SearchResultProps;
};

export const SearchResults = ({ result }: Props) => {
    const [{ params }] = useSearchContext();

    return (
        <div className={style.searchResults}>
            {isInitialDefaultQuery(result, params) ? (
                <SearchResultsEmpty />
            ) : (
                <SearchResultsList result={result} />
            )}
        </div>
    );
};
