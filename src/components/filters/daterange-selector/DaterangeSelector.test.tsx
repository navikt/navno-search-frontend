import React from 'react';
import { render } from '@testing-library/react';
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

describe('DateRangeSelector', () => {
    test('It selects the correct date range radiobox', () => {
        const initialParams = {
            c: 1,
            daterange: 2,
            f: '1',
            ord: 'test',
            s: 1,
            start: 0,
            uf: [],
        };

        const { getByDisplayValue } = setup({
            initialResult: mockResults(),
            initialParams,
        });

        expect(getByDisplayValue('Siste 30 dager')).toBeInTheDocument();
        expect(getByDisplayValue('Siste 30 dager')).toBeChecked();
    });
});
