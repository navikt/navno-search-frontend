import React, { ChangeEvent } from 'react';
import { classNames } from 'utils/classnames';
import { Checkbox, Radio } from "@navikt/ds-react";

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

export type FilterOptionProps = {
    label: string;
    name: string;
    count?: number;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
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
}: FilterOptionProps) => {
    const inputProps = {
        value: label,
        name,
        checked,
        onChange,
        type,
        id,
    };

    return (
        <div className={classNames(style.filterOption)}>
          { inputProps.type === "radio" &&  <Radio {...inputProps}>{label}</Radio>}
          { inputProps.type === "checkbox" && <Checkbox {...inputProps}>{label}</Checkbox>}
          <span className={style.count}>{count}</span>
        </div>
    );
};
