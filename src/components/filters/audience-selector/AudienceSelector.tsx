import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { Heading } from '@navikt/ds-react';
import { logFilterSelection } from '../../../utils/amplitude';
import { CheckboxToggleProps } from '../../../context/reducer';
import { useSearchContext } from '../../../context/ContextProvider';

type Props = {
    setAudience: ({ key, toggle }: CheckboxToggleProps) => void;
};

export const AudienceSelector = ({ setAudience }: Props) => {
    const [{ params }] = useSearchContext();

    console.log(params)

    return (
        <FilterSectionPanel>
            <Heading level="3" size="small">
                {'Målgruppe'}
            </Heading>
            <FilterOption
                label={'Privatperson'}
                name={'privatperson'}
                type={'checkbox'}
                id={'privatperson'}
                checked={params.audience?.includes('privatperson')}
                onChange={(e) => {
                    setAudience({
                        key: 'privatperson',
                        toggle: e.target.checked,
                    });
                    if (e.target.checked) {
                        logFilterSelection('privatperson');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Arbeidsgiver'}
                name={'arbeidsgiver'}
                type={'checkbox'}
                id={'arbeidsgiver'}
                checked={params.audience?.includes('arbeidsgiver')}
                onChange={(e) => {
                    setAudience({
                        key: 'arbeidsgiver',
                        toggle: e.target.checked,
                    });
                    if (e.target.checked) {
                        logFilterSelection('arbeidsgiver');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Samarbeidspartner'}
                name={'samarbeidspartner'}
                type={'checkbox'}
                id={'samarbeidspartner'}
                checked={params.audience?.includes('samarbeidspartner')}
                onChange={(e) => {
                    setAudience({
                        key: 'samarbeidspartner',
                        toggle: e.target.checked,
                    });
                    if (e.target.checked) {
                        logFilterSelection('samarbeidspartner');
                    }
                }}
                alwaysEnabled={true}
            />
        </FilterSectionPanel>
    );
};