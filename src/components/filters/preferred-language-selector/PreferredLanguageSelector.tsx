import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { Heading } from '@navikt/ds-react';
import { logFilterSelection } from '../../../utils/amplitude';
import { useSearchContext } from '../../../context/ContextProvider';

const NB = "nb"
const NN = "nn"
const EN = "en"

type Props = {
    setPreferredLanguage: (preferredLanguage: string) => void;
};

export const PreferredLanguageSelector = ({ setPreferredLanguage }: Props) => {
    const [{ params }] = useSearchContext();

    return (
        <FilterSectionPanel>
            <Heading level="3" size="small">
                {'Foretrukket språk'}
            </Heading>
            <FilterOption
                label={'Bokmål'}
                name={NB}
                type={'radio'}
                id={NB}
                checked={params.preferredLanguage === NB}
                onChange={(e) => {
                    setPreferredLanguage(NB);
                    if (e.target.checked) {
                        logFilterSelection(NB);
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Nynorsk'}
                name={NN}
                type={'radio'}
                id={NN}
                checked={params.preferredLanguage === NN}
                onChange={(e) => {
                    setPreferredLanguage(NN);
                    if (e.target.checked) {
                        logFilterSelection(NN);
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'English'}
                name={EN}
                type={'radio'}
                id={EN}
                checked={params.preferredLanguage === EN}
                onChange={(e) => {
                    setPreferredLanguage(EN);
                    if (e.target.checked) {
                        logFilterSelection(EN);
                    }
                }}
                alwaysEnabled={true}
            />
        </FilterSectionPanel>
    );
};