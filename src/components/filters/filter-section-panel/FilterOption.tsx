import React from 'react';
import classNames from 'classnames';

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

type Props = {
    label: string;
    name: string;
    count: number;
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (args: any) => any;
    type: FilterOptionType;
    id: string;
};

export const FilterOption = ({
    label,
    name,
    count,
    defaultChecked,
    checked,
    onChange,
    type,
    id,
}: Props) => {
    const disabled = !count;
    const inputProps = {
        value: label,
        name,
        defaultChecked: defaultChecked && !!count,
        checked: checked && !!count,
        onChange,
        type,
        id,
        disabled,
    };

    return (
        <span
            className={classNames(
                style.filterOption,
                disabled ? style.disabled : ''
            )}
        >
            <input className={`navds-${type}__input`} {...inputProps} />
            <label className={`navds-${type}__label`} htmlFor={inputProps.id}>
                {label}
                <span className={style.count}>{count}</span>
            </label>
        </span>
    );
};
