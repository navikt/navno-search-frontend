import React from 'react';
import { fireEvent, render, screen, rerender } from '@testing-library/react';
import { FacetsSelector, FacetsSelectorProps } from './FacetsSelector';
import { mockResults } from 'testHelpers/mockResults';
import { ContextProvider, useSearchContext } from 'context/ContextProvider';
import { FacetBucketProps, SearchResultProps } from 'types/search-result';
import { SearchParams, SearchSort } from 'types/search-params';
import { mockFacets } from 'mock/mockFacets';

type SetupConfig = {
    facetsProps: FacetBucketProps[];
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    overrideProps?: Partial<FacetsSelectorProps>;
};

const setup = ({
    initialResult,
    initialParams,
    facetsProps,
    overrideProps,
}: SetupConfig) => {
    const props = {
        facetsProps,
        setFacet: jest.fn(),
        setUnderFacet: jest.fn(),
        ...overrideProps,
    };

    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <FacetsSelector {...props} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};

describe('FacetsSelector', () => {
    const facetsProps = mockFacets();

    const initialResult = mockResults();

    it('renders the facet options correctly and is checked', async () => {
        const { findByDisplayValue } = setup({
            facetsProps,
            initialResult,
        });
        const input = await findByDisplayValue('Privatperson');
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toBeChecked();
    });

    it('does not check the other facets', async () => {
        const { findByDisplayValue } = setup({
            facetsProps,
            initialResult,
        });
        const input = await findByDisplayValue('Arbeidsgiver');
        expect(input).not.toBeChecked();
    });

    it('checks a facet when clicked and calls setFacet', async () => {
        const dummyFunction = jest.fn();
        const { findByDisplayValue } = setup({
            facetsProps,
            initialResult,
            overrideProps: {
                setFacet: dummyFunction,
            },
        });
        const input = await findByDisplayValue('Arbeidsgiver');

        fireEvent.click(input);
        expect(dummyFunction).toHaveBeenCalledTimes(1);
    });

    it('checks the correct faced when updated', async () => {
        const initialParams: SearchParams = {
            f: 'arbeidsgiver',
            ord: 'test',
            page: 0,
            uf: [],
            preferredLanguage: 'nb',
            s: SearchSort.BestMatch,
        };

        const { findByDisplayValue, debug } = setup({
            facetsProps,
            initialResult,
            initialParams,
        });

        const input = await findByDisplayValue('Arbeidsgiver');

        expect(input).toBeChecked();
    });
});
