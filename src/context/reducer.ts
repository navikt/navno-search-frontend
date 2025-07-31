import { searchParamsDefaultFilters } from '../types/search-params';
import { SearchResultProps } from '../types/search-result';
import { Action, ActionType } from './actions';
import { SearchContext } from './ContextProvider';

export type UFToggleProps = {
    uf: string;
    toggle: boolean;
};

// If search results yields 0 hits for a underfacet that was selected by user,
// we need to remove it from the url query params. Otherwise, users will get 0 hits
// for a search string where a hit was possible.
const sanitizeUnderfacets = (
    selectedUf: string[],
    result: SearchResultProps
): string[] => {
    if (!selectedUf || selectedUf.length === 0) return [];

    const availableUnderfacets = new Set<string>();

    if (result?.aggregations?.fasetter?.buckets) {
        result.aggregations.fasetter.buckets.forEach((facet) => {
            if (facet.underaggregeringer?.buckets) {
                facet.underaggregeringer.buckets.forEach((uf) => {
                    availableUnderfacets.add(uf.key);
                });
            }
        });
    }

    return selectedUf.filter((uf) => availableUnderfacets.has(uf));
};

export const reducer = (state: SearchContext, action: Action) => {
    switch (action.type) {
        case ActionType.SetResults:
            const sanitizedUf = sanitizeUnderfacets(
                state.params.uf || [],
                action.result
            );

            // Check if selected underfacets have been sanitized
            // Must be done to avoid endles state update loop.
            const ufChanged =
                JSON.stringify(state.params.uf || []) !==
                JSON.stringify(sanitizedUf);

            if (ufChanged) {
                return {
                    ...state,
                    result: action.result,
                    params: {
                        ...state.params,
                        uf: sanitizedUf,
                    },
                };
            }

            return {
                ...state,
                result: action.result,
            };
        case ActionType.SetParams:
            return { ...state, params: action.params };
        case ActionType.SetSearchTerm:
            return {
                ...state,
                params: { ...state.params, ord: action.searchTerm },
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
