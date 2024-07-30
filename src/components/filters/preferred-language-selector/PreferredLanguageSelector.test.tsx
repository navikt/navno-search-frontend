import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    PreferredLanguageSelector,
    SetPreferredLanguageProps,
} from './PreferredLanguageSelector';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';
import { mock } from 'node:test';

type SetupConfig = {
    initialSearch?: string;
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    mockConfig?: any;
};

const setup = ({
    initialResult,
    initialParams,
    mockConfig = {},
}: SetupConfig) => {
    const props: SetPreferredLanguageProps = {
        setPreferredLanguage: mockConfig.setPreferredLanguage ?? jest.fn(),
    };

    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
            mockConfig={mockConfig}
        >
            <PreferredLanguageSelector {...props} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('SearchFilters', () => {
    test('Has all expected languages', async () => {
        const { findByLabelText } = setup({
            initialResult: mockResults(),
        });

        const inputNb = await findByLabelText('Bokmål');
        const inputNn = await findByLabelText('Nynorsk');
        const inputEn = await findByLabelText('English');

        expect(inputNb).toBeInTheDocument();
        expect(inputNn).toBeInTheDocument();
        expect(inputEn).toBeInTheDocument();
    });

    test('Calls the callback function when clicked', async () => {
        const user = userEvent.setup();
        const mockSetPreferredLanguage = jest.fn();
        const { findByLabelText } = setup({
            initialResult: mockResults(),
            mockConfig: {
                setPreferredLanguage: mockSetPreferredLanguage,
            },
        });

        const inputNb = await findByLabelText('Bokmål');
        const inputNn = await findByLabelText('Nynorsk');

        expect(inputNb).toBeChecked();
        expect(inputNn).not.toBeChecked();

        await user.click(inputNn);

        expect(mockSetPreferredLanguage).toHaveBeenCalledTimes(1);
    });
});
