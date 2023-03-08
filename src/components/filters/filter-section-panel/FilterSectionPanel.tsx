import React from 'react';
import { Panel } from '@navikt/ds-react';

import style from './FilterSectionPanel.module.scss';

type Props = {
    children: React.ReactNode | React.ReactNode[];
};

export const FilterSectionPanel = ({ children }: Props) => {
    return (
        <Panel border className={style.searchFilterPanel}>
            {children}
        </Panel>
    );
};
