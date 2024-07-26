import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from './SearchInput';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams, paramsFromResult } from 'types/search-params';

const mockFetchNewResults = jest.fn();

type SetupConfig = {
    initialSearch?: string;
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
};

const setup = ({
    initialSearch = '',
    initialResult,
    initialParams,
}: SetupConfig) => {
    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <SearchInput
                initialSearchTerm={initialSearch}
                fetchNewResults={mockFetchNewResults}
            />
        </ContextProvider>
    );

    const input = screen.getByRole('searchbox') as HTMLInputElement;
    return {
        input,
        ...utils,
    };
};

describe('SearchInput', () => {
    test('It sets the correct label for the search field', async () => {
        const initialResult = mockResults();
        initialResult.fasettKey = '1';
        const initialParams = paramsFromResult(initialResult);

        const { getByLabelText } = setup({
            initialSearch: '',
            initialResult,
            initialParams,
        });

        expect(getByLabelText('Søk på siden')).toBeInTheDocument();
    });

    test('It updates the search field value', async () => {
        const initialSearch = 'Barnebidrag';
        const newSearch = 'Foreldrepenger';

        const { input } = setup({
            initialSearch,
            initialResult: mockResults(),
        });

        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: newSearch } });
        expect(input.value).toBe(newSearch);
    });

    test('It calls fetchNewResults when the form is submitted', async () => {
        const { input } = setup({ initialResult: mockResults() });

        expect(mockFetchNewResults).toHaveBeenCalledTimes(0);
        fireEvent.submit(input);
        expect(mockFetchNewResults).toHaveBeenCalledTimes(1);
    });
});
