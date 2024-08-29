import { fireEvent, RenderResult } from '@testing-library/react';
import { SearchFilters } from './SearchFilters';
import { mockResults } from 'testHelpers/mockResults';
import { paramsFromResult } from 'types/search-params';
import { componentSetup } from 'testHelpers/componentSetup';

describe('SearchFilters', () => {
    let setupResult: RenderResult;

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        setupResult = componentSetup({
            Component: SearchFilters,
            contextProps: {
                initialResult,
                initialParams,
            },
            componentProps: {
                result: initialResult,
            },
        });
    });

    test('Expands the filter when clicking the expand button (mobile)', async () => {
        const { getByTestId, findAllByText } = setupResult;

        const filterPanel = getByTestId('search-filter-panel');
        expect(filterPanel.classList.contains('visibleMobile')).toBe(false);
        const button = await findAllByText(/Søkefilter/);
        fireEvent.click(button[0]);
        expect(filterPanel.classList.contains('visibleMobile')).toBe(true);
    });
});
