import { fireEvent, RenderResult } from '@testing-library/react';
import { SearchInput } from './SearchInput';
import { mockResults } from 'testHelpers/mockResults';
import { paramsFromResult } from 'types/search-params';
import { componentSetup } from '../../testHelpers/componentSetup';

describe('SearchInput', () => {
    let setupResult: RenderResult;
    const mockFetchNewResults = jest.fn();

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        setupResult = componentSetup({
            Component: SearchInput,
            contextProps: {
                initialResult,
                initialParams,
            },
            componentProps: {
                initialSearchTerm: '',
                fetchNewResults: mockFetchNewResults,
            },
        });
    });

    test('It sets the correct label for the search field', async () => {
        const { getByLabelText } = setupResult;

        expect(getByLabelText('Søk på siden')).toBeInTheDocument();
    });

    test('It updates the search field value', async () => {
        const newSearch = 'Foreldrepenger';

        const { getByRole } = setupResult;

        const input = getByRole('searchbox') as HTMLInputElement;
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: newSearch } });
        expect(input.value).toBe(newSearch);
    });

    test('It calls fetchNewResults when the form is submitted', async () => {
        const { getByRole } = setupResult;

        expect(mockFetchNewResults).toHaveBeenCalledTimes(0);
        const input = getByRole('searchbox');
        fireEvent.submit(input);
        expect(mockFetchNewResults).toHaveBeenCalledTimes(1);
    });
});
