import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { Heading } from '@navikt/ds-react';
import { logFilterSelection } from '../../../utils/amplitude';
import { useSearchContext } from '../../../context/ContextProvider';

type Props = {
    setAudience: (audience: string) => void;
};

export const AudienceSelector = ({ setAudience }: Props) => {
    const [{ params }] = useSearchContext();

    return (
        <FilterSectionPanel>
            <Heading level="3" size="small">
                {'Målgruppe'}
            </Heading>
            <FilterOption
                label={'Privatperson'}
                name={'privatperson'}
                type={'radio'}
                id={'privatperson'}
                checked={params.audience === 'privatperson'}
                onChange={(e) => {
                    setAudience('privatperson');
                    if (e.target.checked) {
                        logFilterSelection('privatperson');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Arbeidsgiver'}
                name={'arbeidsgiver'}
                type={'radio'}
                id={'arbeidsgiver'}
                checked={params.audience === 'arbeidsgiver'}
                onChange={(e) => {
                  setAudience('arbeidsgiver');
                    if (e.target.checked) {
                        logFilterSelection('arbeidsgiver');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Samarbeidspartner'}
                name={'samarbeidspartner'}
                type={'radio'}
                id={'samarbeidspartner'}
                checked={params.audience === 'samarbeidspartner'}
                onChange={(e) => {
                  setAudience('samarbeidspartner');
                    if (e.target.checked) {
                        logFilterSelection('samarbeidspartner');
                    }
                }}
                alwaysEnabled={true}
            />
        </FilterSectionPanel>
    );
};