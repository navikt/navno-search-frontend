import { isInitialDefaultQuery } from '../utils/isInitialDefaultQuery';
import { SearchResultProps } from '../types/search-result';
import { paramsFromResult, SearchParams } from '../types/search-params';
import { mockResults } from 'testHelpers/mockResults';

describe('isInitialDefaultQuery', () => {
    const initialResult = mockResults();
    const initialParams = paramsFromResult(initialResult);

    test('should return true when theres no search query', () => {
        const result: SearchResultProps = {
            ...initialResult,
            word: '',
            isInitialResult: true,
        };
        const params: SearchParams = {
            ...initialParams,
            f: 'privatperson',
            uf: [],
        };

        const isInitial = isInitialDefaultQuery(result, params);
        expect(isInitial).toBe(true);
    });

    test('should return false if result is not empty', () => {
        const result: SearchResultProps = {
            ...initialResult,
            word: 'Foo bar',
            isInitialResult: true,
        };
        const params: SearchParams = {
            ...initialParams,
            f: 'privatperson',
            uf: [],
        };
        const isInitial = isInitialDefaultQuery(result, params);
        expect(isInitial).toBe(false);
    });
});
