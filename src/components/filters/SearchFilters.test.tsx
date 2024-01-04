import React from 'react';
import { render } from '@testing-library/react';
import { SearchFilters } from './SearchFilters';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';

const mockResult = mockResults();

test('renders SearchFilters component', () => {
    render(
        <ContextProvider initialResult={mockResult}>
            <SearchFilters result={mockResult} />
        </ContextProvider>
    );
    expect(true).toBe(true);
});
