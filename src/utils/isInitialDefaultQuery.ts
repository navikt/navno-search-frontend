import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';
import Config from 'config';

const { keys } = Config.VARS;

export const isInitialDefaultQuery = (
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
