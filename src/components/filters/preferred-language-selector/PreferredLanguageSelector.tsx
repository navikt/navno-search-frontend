import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { Heading } from '@navikt/ds-react';
import { logFilterSelection } from '../../../utils/amplitude';
import { useSearchContext } from '../../../context/ContextProvider';

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
                name={'nb'}
                type={'radio'}
                id={'nb'}
                checked={params.preferredLanguage === 'nb'}
                onChange={(e) => {
                    setPreferredLanguage('nb');
                    if (e.target.checked) {
                        logFilterSelection('nb');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'Nynorsk'}
                name={'nn'}
                type={'radio'}
                id={'nn'}
                checked={params.preferredLanguage === 'nn'}
                onChange={(e) => {
                    setPreferredLanguage('nn');
                    if (e.target.checked) {
                        logFilterSelection('nn');
                    }
                }}
                alwaysEnabled={true}
            />
            <FilterOption
                label={'English'}
                name={'en'}
                type={'radio'}
                id={'en'}
                checked={params.preferredLanguage === 'en'}
                onChange={(e) => {
                    setPreferredLanguage('en');
                    if (e.target.checked) {
                        logFilterSelection('en');
                    }
                }}
                alwaysEnabled={true}
            />
        </FilterSectionPanel>
    );
};