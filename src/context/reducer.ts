import {
    daterangeKeyToParam,
    searchParamsDefault,
} from '../types/search-params';
import { Action, ActionType } from './actions';
import { SearchContext } from './ContextProvider';

export type UFToggleProps = {
    uf: string;
    toggle: boolean;
};

export const reducer = (state: SearchContext, action: Action) => {
    switch (action.type) {
        case ActionType.SetResults:
            return { ...state, result: action.result };
        case ActionType.SetParams:
            return { ...state, params: action.params };
        case ActionType.SetSearchTerm:
            return {
                ...state,
                params: { ...state.params, ord: action.searchTerm },
            };
        case ActionType.SetDaterange:
            return {
                ...state,
                params: {
                    ...state.params,
                    daterange: daterangeKeyToParam[action.daterangeKey],
                },
            };
        case ActionType.SetSort:
            return {
                ...state,
                params: { ...state.params, s: action.sort },
            };
        case ActionType.SetFacet:
            return {
                ...state,
                params: { ...state.params, f: action.facet, uf: [] },
            };
        case ActionType.SetUnderfacet:
            const { uf, toggle } = action.underfacetToggle;
            const oldUf = state.params.uf || [];
            const newUf = toggle
                ? oldUf.includes(uf)
                    ? oldUf
                    : [...oldUf, uf]
                : oldUf.filter((item) => item !== uf);
            return {
                ...state,
                params: {
                    ...state.params,
                    uf: newUf.length > 0 ? newUf : [],
                },
            };
        case ActionType.ResetFacets:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...searchParamsDefault,
                },
            };
        default:
            return state;
    }
};
