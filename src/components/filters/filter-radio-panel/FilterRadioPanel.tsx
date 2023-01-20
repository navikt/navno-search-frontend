import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import React from 'react';
import { Radio } from 'nav-frontend-skjema';
import { Undertekst } from 'nav-frontend-typografi';
import { BEM } from '../../../utils/classnames';
import './FilterRadioPanel.less';

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
    const bem = BEM('radio-expanding-panel');

    const header = (
        <div className={bem('header')}>
            <Radio
                name={'search-facet'}
                label={label}
                checked={isOpen}
                readOnly={true}
                id={id}
                tabIndex={-1}
            />
            <Undertekst className={bem('count')}>{count}</Undertekst>
        </div>
    );

    return (
        <EkspanderbartpanelBase
            tittel={header}
            apen={isOpen && !!children}
            border={false}
            className={bem()}
            onClick={onClick}
        >
            {children}
        </EkspanderbartpanelBase>
    );
};
