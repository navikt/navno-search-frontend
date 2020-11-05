import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import React from 'react';
import { Undertekst, Element } from 'nav-frontend-typografi';
import { BEM } from '../../../utils/bem';
import './FilterRadioPanel.less';

type Props = {
    label: string;
    count: number;
    isOpen: boolean;
    onClick: (args?: any) => any;
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
    const bem = BEM('radio-expanding-panel');

    const header = (
        <div className={bem('header')}>
            <input
                type={'radio'}
                name={'search-facet'}
                checked={isOpen}
                readOnly={true}
                id={id}
            />
            <label htmlFor={id} className={'skjemaelement__label'}>
                <Element>{label}</Element>
                <Undertekst className={bem('count')}>{count}</Undertekst>
            </label>
        </div>
    );

    return (
        <EkspanderbartpanelBase
            tittel={header}
            apen={isOpen && !!children}
            border={false}
            className={bem()}
            onClick={(e) => {
                document.getElementById(id)?.focus();
                onClick?.(e);
            }}
        >
            {children}
        </EkspanderbartpanelBase>
    );
};
