import { Accordion, BodyShort, Radio } from '@navikt/ds-react';
import React from 'react';

import style from './FilterRadioPanel.module.scss';

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
            <Radio
                value={label}
                name={'search-facet'}
                checked={isOpen}
                onClick={onClick}
                id={id}
                tabIndex={-1}
            >
                {label}
            </Radio>
            <BodyShort className={style.count}>
                {count}
            </BodyShort>
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
