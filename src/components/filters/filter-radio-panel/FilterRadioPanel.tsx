import { Accordion } from '@navikt/ds-react';
import React from 'react';

import style from './FilterRadioPanel.module.scss';
import { FilterOption } from '../filter-section-panel/FilterOption';

type Props = {
    label: string;
    count: number;
    isOpen: boolean;
    onClick: (args: any) => any;
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

    const header = (
        <div className={style.header}>
            <FilterOption
                type={'radio'}
                label={label}
                count={count}
                name={'search-facet'}
                checked={isOpen}
                onChange={onClick}
                id={id}
            />
        </div>
    );

    return (
        <Accordion
            className={style.radioExpandingPanel}
        >
            <Accordion.Item
                defaultOpen={isOpen && !!children}
            >
                <Accordion.Header>
                    {header}
                </Accordion.Header>
                {children &&
                    <Accordion.Content>
                        {children}
                    </Accordion.Content>
                }
            </Accordion.Item>
        </Accordion>
    );
};
