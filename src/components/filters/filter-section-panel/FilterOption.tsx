import React from 'react';
import { BodyShort } from '@navikt/ds-react';

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
    const inputProps = {
        value: label,
        name,
        defaultChecked: defaultChecked && !!count,
        checked: checked && !!count,
        onChange,
        type,
        id,
        disabled: !count,
    };
    const inputClass = `navds-${type}__input`;
    const labelClass = `navds-${type}__label`;

    return (
        <div className={style.filterOption}>
            <input
                className={inputClass}
                {...inputProps}
            />
            <label className={labelClass} htmlFor={inputProps.id}>
                {label}
            </label>
            <BodyShort className={style.count}>
                {count}
            </BodyShort>
        </div>
    );
};
