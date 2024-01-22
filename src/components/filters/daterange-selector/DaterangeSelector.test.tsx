import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DaterangeSelector } from './DaterangeSelector';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
};

const setup = ({ initialResult, initialParams }: SetupConfig) => {
    const dateRange = initialResult.aggregations.Tidsperiode;

    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <DaterangeSelector daterangeProps={dateRange} />
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
    });
});
