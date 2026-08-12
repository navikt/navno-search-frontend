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
    count: number;
    isOpen: boolean;
    onClick: jest.Mock;
    value: string;
};

const setupTest = ({
    initialResult,
    initialParams,
    label,
    count,
    isOpen,
    onClick,
    value,
}: SetupConfig) => {
    return componentSetup({
        Component: FilterRadioPanel,
        contextProps: {
            initialResult,
            initialParams,
        },
        componentProps: {
            label,
            count,
            isOpen,
            onClick,
            value,
            children: null,
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
            count: 3,
            onClick: mockOnClick,
            value: 'privatperson',
        });
    });

    test('It displays the proper label for the filter', () => {
        const { getByLabelText } = setupResult;

        expect(getByLabelText('Filter option label')).toBeInTheDocument();
    });

    test('It calls the proper function when the radio changes after click', () => {
        const { getByLabelText } = setupResult;

        fireEvent.click(getByLabelText('Filter option label'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
