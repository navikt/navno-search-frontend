import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreferredLanguageSelector } from './PreferredLanguageSelector';
import { mockResults } from 'testHelpers/mockResults';
import { paramsFromResult } from 'types/search-params';
import { componentSetup } from 'testHelpers/componentSetup';

describe('SearchFilters', () => {
    let setupResult: RenderResult;
    const mockSetPreferredLanguage = jest.fn();

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        setupResult = componentSetup({
            Component: PreferredLanguageSelector,
            contextProps: {
                initialResult,
                initialParams,
            },
            componentProps: {
                setPreferredLanguage: mockSetPreferredLanguage,
            },
        });
    });
    test('Has all expected languages', async () => {
        const { findByLabelText } = setupResult;

        const inputNb = await findByLabelText('Bokmål');
        const inputNn = await findByLabelText('Nynorsk');
        const inputEn = await findByLabelText('English');

        expect(inputNb).toBeInTheDocument();
        expect(inputNn).toBeInTheDocument();
        expect(inputEn).toBeInTheDocument();
    });

    test('Calls the callback function when clicked', async () => {
        const user = userEvent.setup();
        const { findByLabelText } = setupResult;

        const inputNb = await findByLabelText('Bokmål');
        const inputNn = await findByLabelText('Nynorsk');

        expect(inputNb).toBeChecked();
        expect(inputNn).not.toBeChecked();

        await user.click(inputNn);

        expect(mockSetPreferredLanguage).toHaveBeenCalledTimes(1);
    });
});
