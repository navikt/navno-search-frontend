import React, { ChangeEvent } from 'react';
import { FilterOption } from '../filter-section-panel/FilterOption';

import style from './FilterRadioPanel.module.scss';

type Props = {
    label: string;
    count: number;
    isOpen: boolean;
    onClick: (args: ChangeEvent<HTMLInputElement>) => void;
    id: string;
    children: React.ReactNode | React.ReactNode[];
};

export const FilterRadioPanel = ({
    label,
    count,
    isOpen,
    onClick,
    id,
    children,
}: Props) => {
    return (
        <div className={style.panel}>
            <FilterOption
                type={'radio'}
                label={label}
                count={count}
                name={'search-facet'}
                checked={isOpen}
                onChange={onClick}
                id={id}
            />
            {isOpen && !!children && (
                <div className={style.panelContent} id={`panel-${id}`}>
                    {children}
                </div>
            )}
        </div>
    );
};
