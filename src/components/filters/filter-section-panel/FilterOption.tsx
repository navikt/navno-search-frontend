import React from 'react';
import { classNames } from '../../../utils/classnames';

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

type Props = {
    label: string;
    name: string;
    count?: number;
    checked?: boolean;
    onChange?: (args: any) => any;
    type: FilterOptionType;
    id: string;
};

export const FilterOption = ({
    label,
    name,
    count,
    checked,
    onChange,
    type,
    id,
}: Props) => {
    const inputProps = {
        value: label,
        name,
        checked,
        onChange,
        type,
        id,
    };

    return (
        <span className={classNames(style.filterOption)}>
            <input className={`navds-${type}__input`} {...inputProps} />
            <label className={`navds-${type}__label`} htmlFor={inputProps.id}>
                {label}
                <span className={style.count}>{count}</span>
            </label>
        </span>
    );
};
