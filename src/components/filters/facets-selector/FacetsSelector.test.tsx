import React from 'react';
import {
    fireEvent,
    getByDisplayValue,
    render,
    RenderResult,
} from '@testing-library/react';
import { FacetsSelector, FacetsSelectorProps } from './FacetsSelector';
import { mockResults } from 'testHelpers/mockResults';
import { mockFacets } from 'testHelpers/mockFacets';
import { ContextProvider } from 'context/ContextProvider';
import { FacetBucketProps, SearchResultProps } from 'types/search-result';
import {
    paramsFromResult,
    SearchParams,
    SearchSort,
} from 'types/search-params';
import { componentSetup } from 'testHelpers/componentSetup';
import { init } from 'next/dist/compiled/webpack/webpack';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    mockSetFacet: jest.Mock;
    mockSetUnderFacet: jest.Mock;
};

const setupTest = ({
    initialResult,
    initialParams,
    mockSetFacet,
    mockSetUnderFacet,
}: SetupConfig) => {
    return componentSetup({
        Component: FacetsSelector,
        contextProps: {
            initialResult,
            initialParams,
        },
        componentProps: {
            facetsProps: mockFacets(),
            setFacet: mockSetFacet,
            setUnderFacet: mockSetUnderFacet,
        },
    });
};

describe('FacetsSelector', () => {
    let setupResult: RenderResult;
    let rerender;
    const mockSetFacet = jest.fn();
    const mockSetUnderFacet = jest.fn();

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        initialParams.f = 'privatperson';

        setupResult = setupTest({
            initialResult,
            initialParams,
            mockSetFacet,
            mockSetUnderFacet,
        });

        rerender = setupResult.rerender;
    });

    test('renders the facet options correctly and is checked', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Privatperson');
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toBeChecked();
    });

    test('does not check the other facets', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Arbeidsgiver');
        expect(input).not.toBeChecked();
    });

    test('checks a facet when clicked and calls setFacet', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Arbeidsgiver');

        fireEvent.click(input);
        expect(mockSetFacet).toHaveBeenCalledTimes(1);
    });

    test('checks the correct facet when updated', async () => {
        setupResult.unmount();

        const initialParams: SearchParams = {
            f: 'arbeidsgiver',
            ord: 'test',
            page: 0,
            uf: [],
            preferredLanguage: 'nb',
            s: SearchSort.BestMatch,
        };

        const initialResult = mockResults();

        setupTest({
            initialResult,
            initialParams,
            mockSetFacet,
            mockSetUnderFacet,
        });

        const { findByDisplayValue } = setupResult;

        const input = await findByDisplayValue('Arbeidsgiver');

        expect(input).toBeChecked();
    });
});
