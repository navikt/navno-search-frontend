import { DaterangeKey, SearchResultProps } from '../types/search-result';
import { SearchParams, SearchSort } from '../types/search-params';
import { UFToggleProps } from './reducer';

export enum ActionType {
    SetResults,
    SetParams,
    SetSearchTerm,
    SetDaterange,
    SetSort,
    SetFacet,
    SetUnderfacet,
    SetAudience,
    SetPreferredLanguage,
    ResetFilters,
}

export type Action =
    | {
          type: ActionType.SetResults;
          result: SearchResultProps;
      }
    | {
          type: ActionType.SetParams;
          params: SearchParams;
      }
    | {
          type: ActionType.SetSearchTerm;
          searchTerm: string;
      }
    | {
          type: ActionType.SetDaterange;
          daterangeKey: DaterangeKey;
      }
    | {
          type: ActionType.SetSort;
          sort: SearchSort;
      }
    | {
          type: ActionType.SetFacet;
          facet: string;
      }
    | {
          type: ActionType.SetUnderfacet;
          underfacetToggle: UFToggleProps;
      }
    | {
          type: ActionType.SetAudience;
          audience: string;
      }
    | {
          type: ActionType.SetPreferredLanguage;
          preferredLanguage: string;
      }
    | {
          type: ActionType.ResetFilters;
      };
