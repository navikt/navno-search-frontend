import {
    daterangeKeyToParam,
    searchParamsDefaultFilters,
} from '../types/search-params';
import { Action, ActionType } from './actions';
import { SearchContext } from './ContextProvider';

export type CheckboxToggleProps = {
    key: string;
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
            const { key: ufKey, toggle: ufToggle } = action.underfacetToggle;
            const oldUf = state.params.uf || [];
            const newUf = ufToggle
                ? oldUf.includes(ufKey)
                    ? oldUf
                    : [...oldUf, ufKey]
                : oldUf.filter((item) => item !== ufKey);
            return {
                ...state,
                params: {
                    ...state.params,
                    uf: newUf.length > 0 ? newUf : [],
                },
            };
        case ActionType.SetAudience:
            return {
                ...state,
                params: {
                    ...state.params,
                    audience: action.audience,
                },
            };
        case ActionType.SetPreferredLanguage:
            return {
                ...state,
                params: {
                    ...state.params,
                    preferredLanguage: action.preferredLanguage,
                },
            };
        case ActionType.ResetFilters:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...searchParamsDefaultFilters,
                },
            };
        default:
            return state;
    }
};
