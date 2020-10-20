import React from 'react';
import { Innholdstittel, Undertittel } from 'nav-frontend-typografi';
import './SearchHeader.less';

type Props = {
    facet: string;
};

export const SearchHeader = ({ facet }: Props) => (
    <div className={'search-header'} id={'search-header'}>
        <Innholdstittel>{'Søk'}</Innholdstittel>
        <Undertittel>{facet}</Undertittel>
    </div>
);
