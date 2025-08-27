import React from 'react';
import { Radio } from '@navikt/ds-react';

import style from './FilterRadioPanel.module.scss';

export type FilterRadioPanelProps = {
    label: string;
    count: number;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode | React.ReactNode[];
    value: string;
};

export const FilterRadioPanel = ({
    label,
    count,
    isOpen,
    onClick,
    children,
    value,
}: FilterRadioPanelProps) => {
    return (
        <div className={style.panel}>
            <div className={style.radioWrapper}>
                <Radio 
                    value={value}
                    onClick={onClick}
                    className={style.radio}
                >
                    {label}
                </Radio>
                <span className={style.count}>{count}</span>
            </div>
            {isOpen && !!children && (
                <div className={style.panelContent}>
                    {children}
                </div>
            )}
        </div>
    );
};
