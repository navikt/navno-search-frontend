import React, { Dispatch, useContext, useReducer } from 'react';
import { SearchParams, searchParamsDefault } from '../types/search-params';
import { SearchResultProps } from '../types/search-result';
import { reducer } from './reducer';
import { Action } from './actions';

export type SearchContext = {
    params: SearchParams;
    result: SearchResultProps;
};

export const SearchContext = React.createContext(
    {} as [SearchContext, Dispatch<Action>]
);

type Props = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    mockConfig?: any;
    children: React.ReactNode;
};

export const ContextProvider = ({
    initialResult,
    initialParams = searchParamsDefault,
    mockConfig = {},
    children,
}: Props) => {
    const [state, dispatch] = useReducer(reducer, {
        result: initialResult,
        params: initialParams,
    });

    const { mockDispatch } = mockConfig;

    const actualDispatch = mockDispatch ?? dispatch;

    return (
        <SearchContext.Provider value={[state, actualDispatch]}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => useContext(SearchContext);
