import { fireEvent, RenderResult } from '@testing-library/react';
import { FilterRadioPanel } from './FilterRadioPanel';
import { mockResults } from 'testHelpers/mockResults';
import { SearchResultProps } from 'types/search-result';
import { paramsFromResult, SearchParams } from 'types/search-params';
import { componentSetup } from 'testHelpers/componentSetup';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    label: string;
    isOpen: boolean;
    onClick: jest.Mock;
};

const setupTest = ({
    initialResult,
    initialParams,
    label,
    isOpen,
    onClick,
}: SetupConfig) => {
    return componentSetup({
        Component: FilterRadioPanel,
        contextProps: {
            initialResult,
            initialParams,
        },
        componentProps: {
            label,
            isOpen,
            onClick,
        },
    });
};

describe('FilterRadioPanel', () => {
    let setupResult: RenderResult;
    const mockOnClick = jest.fn();

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        initialParams.f = 'privatperson';

        setupResult = setupTest({
            initialResult,
            initialParams,
            isOpen: false,
            label: 'Filter option label',
            onClick: mockOnClick,
        });
    });

    test('It displays the proper label for the filter', () => {
        const { getByDisplayValue } = setupResult;

        // expect(true).toBe(true);
        expect(getByDisplayValue('Filter option label')).toBeInTheDocument();
    });

    test('It calls the proper function when the radio changes after click', () => {
        const { getByDisplayValue } = setupResult;

        fireEvent.click(getByDisplayValue('Filter option label'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
