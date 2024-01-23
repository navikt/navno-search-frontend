import React from 'react';
import { render } from '@testing-library/react';
import { SearchDescription } from './SearchDescription';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
};

const setup = ({ initialResult, initialParams }: SetupConfig) => {
    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <SearchDescription result={initialResult} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('FilterRadioPanel', () => {
    test("It doesn't show if default filters are set.", () => {
        const { queryByTestId } = setup({
            initialResult: mockResults(),
        });

        expect(queryByTestId('search-description')).not.toBeInTheDocument();
    });

    test('It shows when non-default filters are set.', () => {
        const initialParams = {
            c: 1,
            daterange: 2,
            f: '1',
            ord: 'test',
            s: 1,
            start: 0,
            uf: [],
        };

        const { queryByTestId } = setup({
            initialResult: mockResults(),
            initialParams,
        });

        expect(queryByTestId('search-description')).toBeInTheDocument();
    });

    test('It shows a label indicating the selected date range if not default', () => {
        const initialParams = {
            c: 1,
            daterange: 1,
            f: '1',
            ord: 'test',
            s: 1,
            start: 0,
            uf: [],
        };

        const { queryByText } = setup({
            initialResult: mockResults(),
            initialParams,
        });

        expect(queryByText('Siste 12 måneder')).toBeInTheDocument();
    });

    test('It does not show the label indicated date range if the default range is selected', () => {
        const initialParams = {
            c: 1,
            daterange: 0,
            f: '1',
            ord: 'test',
            s: 1,
            start: 0,
            uf: [],
        };

        const { queryByText } = setup({
            initialResult: mockResults(),
            initialParams,
        });

        expect(queryByText('Alle datoer')).not.toBeInTheDocument();
    });
});
