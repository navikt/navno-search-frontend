import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';

const mockResult = mockResults();
const mockFetchNewResults = jest.fn();

test('renders SearchInput component', async () => {
    const initialSearch = 'Foo';
    const { getByDisplayValue } = render(
        <ContextProvider initialResult={mockResult}>
            <SearchInput
                result={mockResult}
                initialSearchTerm={initialSearch}
                fetchNewResults={mockFetchNewResults}
            />
        </ContextProvider>
    );

    const input = screen.getByLabelText('Innhold');
    expect(getByDisplayValue(initialSearch)).toBeInTheDocument();
});
