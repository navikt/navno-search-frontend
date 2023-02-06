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

    return (
        <Accordion
            className={style.radioExpandingPanel}
        >
            <Accordion.Item
                open={isOpen && !!children}
            >
                <Accordion.Header>
                    <FilterOption
                        className={style.header}
                        type={'radio'}
                        label={label}
                        count={count}
                        name={'search-facet'}
                        checked={isOpen}
                        onChange={onClick}
                        id={id}
                    />
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
