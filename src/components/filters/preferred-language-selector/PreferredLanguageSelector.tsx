import React from 'react';
import { Radio } from '@navikt/ds-react';
import { logFilterSelection } from 'utils/analytics';

const NB = 'nb';
const NN = 'nn';
const EN = 'en';

export const PreferredLanguageSelector = () => {
    const handleRadioClick = (language: string) => {
        logFilterSelection(language);
    };

    return (
        <>
            <Radio value={NB} onClick={() => handleRadioClick(NB)}>
                Bokmål
            </Radio>
            <Radio value={NN} onClick={() => handleRadioClick(NN)}>
                Nynorsk
            </Radio>
            <Radio value={EN} onClick={() => handleRadioClick(EN)}>
                English
            </Radio>
        </>
    );
};
