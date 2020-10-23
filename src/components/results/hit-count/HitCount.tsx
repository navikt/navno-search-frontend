import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Config } from '../../../config';
import { BEM } from '../../../utils/bem';
import { quote } from '../../../utils/quote';
import './HitCount.less';

type Props = {
    searchTerm: string;
    hitCount: number;
};

export const HitCount = ({ searchTerm, hitCount }: Props) => {
    const bem = BEM('hit-count');

    return (
        <div className={bem()}>
            {hitCount > 0 ? (
                <Normaltekst>
                    {`${hitCount} treff`}
                    {searchTerm && (
                        <>
                            {' for '}
                            <span className={bem('term')}>
                                {quote(searchTerm)}
                            </span>
                        </>
                    )}
                </Normaltekst>
            ) : (
                <>
                    <Undertittel>
                        {`Ingen treff${
                            searchTerm ? ` for ${quote(searchTerm)}` : ''
                        }.`}
                    </Undertittel>
                    <Normaltekst>
                        {
                            'Prøv igjen med mer generelle søkeord, eller forsøk andre søkefiltre. '
                        }
                        <Lenke href={Config.PATHS.searchTips}>
                            {'Se søketips'}
                        </Lenke>
                    </Normaltekst>
                </>
            )}
        </div>
    );
};
