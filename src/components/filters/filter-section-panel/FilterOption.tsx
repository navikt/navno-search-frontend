import React, { ChangeEvent } from 'react';
import { Checkbox, Radio } from '@navikt/ds-react';
import { classNames } from 'utils/classnames';

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

export type FilterOptionProps = {
    label: string;
    value: string;
    name: string;
    count?: number;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    type: FilterOptionType;
    id: string;
};

export const FilterOption = ({
    label,
    value,
    name,
    count,
    checked,
    onChange,
    type,
    id,
}: FilterOptionProps) => {
    const inputProps = {
        value,
        name,
        checked,
        onChange,
        type,
        id,
    };

    const SelectElement = type === 'radio' ? Radio : Checkbox;

    return (
        <div className={classNames(style.filterOption)}>
            <SelectElement {...inputProps}>{label}</SelectElement>
            <span className={style.count}>{count}</span>
        </div>
    );
};
