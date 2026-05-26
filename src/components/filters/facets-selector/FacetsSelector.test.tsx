import { fireEvent, render, RenderResult } from '@testing-library/react';
import { RadioGroup } from '@navikt/ds-react';
import { FacetsSelector } from './FacetsSelector';
import { mockResults } from 'testHelpers/mockResults';
import { mockFacets } from 'testHelpers/mockFacets';
import { SearchResultProps } from 'types/search-result';
import {
    paramsFromResult,
    SearchParams,
    SearchSort,
} from 'types/search-params';
import { ContextProvider } from 'context/ContextProvider';

type SetupConfig = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
    mockSetUnderFacet: jest.Mock;
};

const setupTest = ({
    initialResult,
    initialParams,
    mockSetUnderFacet,
}: SetupConfig) => {
    return render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <RadioGroup legend="test" hideLegend value={initialParams?.f || ''}>
                <FacetsSelector
                    facetsProps={mockFacets()}
                    setUnderFacet={mockSetUnderFacet}
                />
            </RadioGroup>
        </ContextProvider>
    );
};

describe('FacetsSelector', () => {
    let setupResult: RenderResult;
    const mockSetUnderFacet = jest.fn();

    beforeEach(() => {
        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);

        initialParams.f = 'privatperson';

        setupResult = setupTest({
            initialResult,
            initialParams,
            mockSetUnderFacet,
        });
    });

    test('renders the facet options correctly and is checked', async () => {
        const { findByLabelText } = setupResult;
        const input = await findByLabelText('Privatperson');
        expect(input).toHaveAttribute('type', 'radio');
        expect(input).toBeChecked();
    });

    test('does not check the other facets from the start', async () => {
        const { findByLabelText } = setupResult;
        const input = await findByLabelText('Arbeidsgiver');
        expect(input).not.toBeChecked();
    });

    test('calls onChange when an option is clicked', async () => {
        setupResult.unmount();

        const initialResult = mockResults();
        const initialParams = paramsFromResult(initialResult);
        initialParams.f = 'privatperson';

        const mockOnChange = jest.fn();

        const result = render(
            <ContextProvider
                initialResult={initialResult}
                initialParams={initialParams}
            >
                <RadioGroup legend="test" hideLegend value={initialParams.f} onChange={mockOnChange}>
                    <FacetsSelector
                        facetsProps={mockFacets()}
                        setUnderFacet={mockSetUnderFacet}
                    />
                </RadioGroup>
            </ContextProvider>
        );

        const input = await result.findByLabelText('Arbeidsgiver');

        fireEvent.click(input);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
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

        const result = setupTest({
            initialResult,
            initialParams,
            mockSetUnderFacet,
        });

        const input = await result.findByLabelText('Arbeidsgiver');

        expect(input).toBeChecked();
    });
});
