import React from 'react';
import {
    render,
    screen,
    fireEvent,
    act,
    findByLabelText,
} from '@testing-library/react';
import {
    PreferredLanguageSelector,
    SetPreferredLanguageProps,
} from './PreferredLanguageSelector';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type SetupConfig = {
    initialSearch?: string;
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    overrideProps?: SetPreferredLanguageProps;
};

const setup = ({
    initialResult,
    initialParams,
    overrideProps,
}: SetupConfig) => {
    const initialProps: SetPreferredLanguageProps = {
        setPreferredLanguage: jest.fn(),
        ...overrideProps,
    };
    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <PreferredLanguageSelector {...initialProps} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('SearchFilters', () => {
    test('Calls the callback function when clicked', async () => {
        const mockCallback = jest.fn();
        const { findByLabelText } = setup({
            initialResult: mockResults(),
            overrideProps: { setPreferredLanguage: mockCallback },
        });

        const input = await findByLabelText('Nynorsk');
        fireEvent.click(input);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});
