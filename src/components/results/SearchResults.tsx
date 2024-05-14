import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { SearchResultsList } from './search-results-list/SearchResultsList';
import { SearchResultsEmpty } from './search-results-empty/SearchResultsEmpty';
import { isInitialDefaultQuery } from '../../utils/isInitialDefaultQuery';

import style from './SearchResults.module.scss';

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
