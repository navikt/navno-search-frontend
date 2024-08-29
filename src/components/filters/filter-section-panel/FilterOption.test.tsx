import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterOption, FilterOptionProps } from './FilterOption';

const mockFunction = jest.fn();

const setup = (configOverride: Partial<FilterOptionProps>) => {
    const config: FilterOptionProps = {
        label: 'Filter option label',
        name: 'foo-filter-option',
        count: 1,
        checked: true,
        onChange: () => {},
        type: 'radio',
        id: 'baz',
        ...configOverride,
    };

    const utils = render(<FilterOption {...config} />);

    return {
        ...utils,
    };
};

describe('FilterOption', () => {
    test('It displays the FilterOption with the correct label', () => {
        setup({
            label: 'Filter option label',
        });

        expect(screen.getByText('Filter option label')).toBeInTheDocument();
    });

    test('It calls the onChange-function', () => {
        const utils = setup({
            label: 'Filter option label',
            onChange: mockFunction,
            checked: false,
        });

        const input = utils.getByDisplayValue('Filter option label');

        fireEvent.click(input);

        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test('It checks the option when prop "checked" is true', () => {
        const utils = setup({
            label: 'Filter option label',
            count: 0,
            checked: true,
        });

        const input = utils.getByDisplayValue('Filter option label');

        expect(input).toBeChecked();
    });
});
