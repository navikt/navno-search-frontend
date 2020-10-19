import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { BEM } from '../../utils/bem';
import { Radio } from 'nav-frontend-skjema';
import { SearchSort } from '../../types/search-params';
import { Config } from '../../config';
import Lenke from 'nav-frontend-lenker';
import './SearchSorting.less';

type Props = {
    isSortDate: boolean;
    setSort: (s: SearchSort) => void;
    searchTerm: string;
    numHits: number;
};

export const SearchSorting = ({
    isSortDate,
    setSort,
    searchTerm,
    numHits,
}: Props) => {
    const bem = BEM('search-sorting-row');

    const hitsCountText = `${numHits} treff${
        searchTerm ? ` for "${searchTerm}"` : ''
    }`;

    return (
        <div className={bem()}>
            <div className={bem('selector')}>
                <label>
                    <Normaltekst>{'Sortér etter:'}</Normaltekst>
                </label>
                <div className={bem('buttons')}>
                    <Radio
                        label={'Beste treff'}
                        name={'search-sorting'}
                        defaultChecked={!isSortDate}
                        onChange={() => setSort(SearchSort.BestMatch)}
                    />
                    <Radio
                        label={'Dato'}
                        name={'search-sorting'}
                        defaultChecked={isSortDate}
                        onChange={() => setSort(SearchSort.Newest)}
                    />
                </div>
            </div>
            <div className={bem('hits-and-tips')}>
                <Lenke href={Config.PATHS.searchTips}>{'Søketips'}</Lenke>
                <Normaltekst>{hitsCountText}</Normaltekst>
            </div>
        </div>
    );
};
