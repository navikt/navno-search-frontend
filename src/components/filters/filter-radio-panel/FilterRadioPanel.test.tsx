import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { FilterRadioPanel, FilterRadioPanelProps } from './FilterRadioPanel';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    overrideProps?: Partial<FilterRadioPanelProps>;
};

const setup = ({
    initialResult,
    initialParams,
    overrideProps = {},
}: SetupConfig) => {
    const props = {
        label: 'Filter option label',
        count: 1,
        isOpen: false,
        onClick: () => {},
        id: '123-foobar',
        children: <div>Test</div>,
        ...overrideProps,
    };

    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <FilterRadioPanel {...props} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('FilterRadioPanel', () => {
    test('It displays the proper label for the filter', () => {
        const { getByDisplayValue } = setup({
            initialResult: mockResults(),
            overrideProps: {
                label: 'Filter option label',
            },
        });

        // expect(true).toBe(true);
        expect(getByDisplayValue('Filter option label')).toBeInTheDocument();
    });

    test('It calls the proper function when the radio changes after click', () => {
        const mockFunction = jest.fn();
        const { getByDisplayValue } = setup({
            initialResult: mockResults(),
            overrideProps: {
                label: 'Filter option label',
                isOpen: false,
                onClick: mockFunction,
            },
        });

        fireEvent.click(getByDisplayValue('Filter option label'));
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test('It shows children when the option is selected', () => {
        const { getByText } = setup({
            initialResult: mockResults(),
            overrideProps: {
                label: 'Filter option label',
                isOpen: true,
                children: <div>Child element</div>,
            },
        });

        expect(getByText('Child element')).toBeInTheDocument();
    });

    test('It hides children when the option is selected', () => {
        const { queryByText } = setup({
            initialResult: mockResults(),
            overrideProps: {
                label: 'Filter option label',
                isOpen: false,
                children: <div>Child element</div>,
            },
        });

        expect(queryByText('Child element')).not.toBeInTheDocument();
    });
});
