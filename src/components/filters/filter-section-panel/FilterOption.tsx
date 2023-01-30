import React from 'react';
import { BodyShort, Checkbox, Radio } from '@navikt/ds-react';

import style from './FilterOption.module.scss';

export type FilterOptionType = 'radio' | 'checkbox';

type Props = {
    label: string;
    name: string;
    count: number;
    checked?: boolean;
    onClick?: (args: any) => any;
    type: FilterOptionType;
    id: string;
};

export const FilterOption = ({
    label,
    name,
    count,
    checked,
    onClick,
    type,
    id,
}: Props) => {
    const buttonProps = {
        value: label,
        name,
        checked: checked && !!count,
        onClick,
        id,
        disabled: !count,
    };

    return (
        <div className={style.searchFilterOption}>
            {type === 'radio' ? (
                <Radio {...buttonProps}>
                    {label}
                </Radio>
            ) : (
                <Checkbox {...buttonProps}>
                    {label}
                </Checkbox>
            )}
            <BodyShort className={style.count}>
                {count}
            </BodyShort>
        </div>
    );
};
