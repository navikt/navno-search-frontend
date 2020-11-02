import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { BEM } from '../../utils/bem';
import { Radio } from 'nav-frontend-skjema';
import { SearchSort } from '../../types/search-params';
import { Config } from '../../config';
import Lenke from 'nav-frontend-lenker';
import { quote } from '../../utils/quote';
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
    const bem = BEM('search-sorting');

    return (
        <div className={bem()}>
            <div className={bem('selector')}>
                <Normaltekst>{'Sorter etter:'}</Normaltekst>
                <div className={bem('buttons')}>
                    <Radio
                        label={'Beste treff'}
                        name={'search-sorting'}
                        defaultChecked={!isSortDate}
                        onChange={() => setSort(SearchSort.BestMatch)}
                        id={'select-sort-best'}
                    />
                    <Radio
                        label={'Dato'}
                        name={'search-sorting'}
                        defaultChecked={isSortDate}
                        onChange={() => setSort(SearchSort.Newest)}
                        id={'select-sort-date'}
                    />
                </div>
            </div>
            <div className={bem('hits-and-tips')}>
                <Lenke href={Config.PATHS.searchTips}>{'Søketips'}</Lenke>
                <Normaltekst className={bem('hits')}>
                    {`${numHits} treff`}
                    <span className={bem('hits-verbose')}>
                        {searchTerm && (
                            <>
                                {' for '}
                                <span className={bem('term')}>
                                    {quote(searchTerm)}
                                </span>
                            </>
                        )}
                    </span>
                </Normaltekst>
            </div>
        </div>
    );
};
