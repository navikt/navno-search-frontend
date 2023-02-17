import React from 'react';
import { Label, Loader } from '@navikt/ds-react';

import style from './Spinner.module.scss';

type Props = {
    text?: string;
};

export const Spinner = ({ text }: Props) => (
    <div className={style.container}>
        {text && <Label>{text}</Label>}
        <Loader size="2xlarge" className={style.spinner} />
    </div>
);
