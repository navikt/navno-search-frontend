import React from 'react';
import classNames from 'classnames';

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

type Props = {
    className?: string;
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
    className,
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
    const inputClass = `navds-${type}__input`;
    const labelClass = `navds-${type}__label`;

    return (
        <span className={classNames(className, style.filterOption, disabled ? style.disabled : '')}>
            <input
                className={inputClass}
                {...inputProps}
            />
            <label className={labelClass} htmlFor={inputProps.id}>
                {label}
                <span className={style.count}>
                    {count}
                </span>
            </label>
        </span>
    );
};
