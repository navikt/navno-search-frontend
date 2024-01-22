import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchFilters } from './SearchFilters';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

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
            <SearchFilters result={initialResult} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('SearchFilters', () => {
    test('Expands the filter when clicking the expand button (mobile)', () => {
        setup({
            initialResult: mockResults(),
        });

        const filterPanel = screen.getByTestId('search-filter-panel');
        expect(filterPanel.classList.contains('visibleMobile')).toBe(false);
        const button = screen.getByText('Vis søkefilter');
        fireEvent.click(button);
        expect(filterPanel.classList.contains('visibleMobile')).toBe(true);
    });
});
