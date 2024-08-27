import { fireEvent, RenderResult } from '@testing-library/react';
import { FacetsSelector } from './FacetsSelector';
import { mockResults } from 'testHelpers/mockResults';
import { mockFacets } from 'testHelpers/mockFacets';
import { SearchResultProps } from 'types/search-result';
import {
    paramsFromResult,
    SearchParams,
    SearchSort,
} from 'types/search-params';
import { componentSetup } from 'testHelpers/componentSetup';

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
    });

    test('renders the facet options correctly and is checked', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Privatperson');
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toBeChecked();
    });

    test('does not check the other facets from the start', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Arbeidsgiver');
        expect(input).not.toBeChecked();
    });

    test('calls setFacet when an option is clicked', async () => {
        const { findByDisplayValue } = setupResult;
        const input = await findByDisplayValue('Arbeidsgiver');

        fireEvent.click(input);
        expect(mockSetFacet).toHaveBeenCalledTimes(1);
    });

    test('checks the correct facet when props are updated', async () => {
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
