import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Config } from '../../../config';
import './NoHits.less';

type Props = {
    searchTerm: string;
};

export const NoHits = ({ searchTerm }: Props) => {
    return (
        <div className={'no-hits'}>
            <Undertittel>
                {`Ingen treff${searchTerm ? ` for "${searchTerm}"` : ''}.`}
            </Undertittel>
            <Normaltekst>
                {
                    'Prøv igjen med mer generelle søkeord, eller forsøk andre søkefiltre. '
                }
                <Lenke href={Config.PATHS.searchTips}>{'Se søketips'}</Lenke>
            </Normaltekst>
        </div>
    );
};
