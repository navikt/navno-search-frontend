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
    const PRIVATPERSON = 'privatperson';
    const ARBEIDSGIVER = 'arbeidsgiver';
    const SAMARBEIDSPARTNER = 'samarbeidspartner';

    return (
        <FilterSectionPanel>
            <Heading level="3" size="small">
                {'Målgruppe'}
            </Heading>
            <FilterOption
                label={'Privatperson'}
                name={PRIVATPERSON}
                type={'radio'}
                id={PRIVATPERSON}
                checked={params.audience === PRIVATPERSON}
                onChange={(e) => {
                    setAudience(PRIVATPERSON);
                    if (e.target.checked) {
                        logFilterSelection(PRIVATPERSON);
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Arbeidsgiver'}
                name={ARBEIDSGIVER}
                type={'radio'}
                id={ARBEIDSGIVER}
                checked={params.audience === ARBEIDSGIVER}
                onChange={(e) => {
                    setAudience(ARBEIDSGIVER);
                    if (e.target.checked) {
                        logFilterSelection(ARBEIDSGIVER);
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Samarbeidspartner'}
                name={SAMARBEIDSPARTNER}
                type={'radio'}
                id={SAMARBEIDSPARTNER}
                checked={params.audience === SAMARBEIDSPARTNER}
                onChange={(e) => {
                    setAudience(SAMARBEIDSPARTNER);
                    if (e.target.checked) {
                        logFilterSelection(SAMARBEIDSPARTNER);
                    }
                }}
                alwaysEnabled={true}
            />
        </FilterSectionPanel>
    );
};