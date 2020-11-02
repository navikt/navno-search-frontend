import React, { Dispatch, useContext, useReducer } from 'react';
import { SearchParams, searchParamsDefault } from '../types/search-params';
import { SearchResultProps } from '../types/search-result';
import { reducer } from './reducer';
import { Action } from './actions';

export type SearchContext = {
    params: SearchParams;
    result: SearchResultProps;
};

const SearchContext = React.createContext(
    {} as [SearchContext, Dispatch<Action>]
);

type Props = {
    initialResults: SearchResultProps;
    initialParams?: SearchParams;
    children: React.ReactNode;
};

export const ContextProvider = ({
    initialResults,
    initialParams = searchParamsDefault,
    children,
}: Props) => {
    return (
        <SearchContext.Provider
            value={useReducer(reducer, {
                result: initialResults,
                params: initialParams,
            })}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => useContext(SearchContext);
