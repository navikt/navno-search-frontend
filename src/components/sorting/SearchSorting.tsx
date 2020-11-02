import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { BEM } from '../../utils/bem';
import { Radio } from 'nav-frontend-skjema';
import { SearchSort } from '../../types/search-params';
import { Config } from '../../config';
import Lenke from 'nav-frontend-lenker';
import { quote } from '../../utils/quote';
import { useSearchContext } from '../../context/ContextProvider';
import { ActionType } from '../../context/actions';
import './SearchSorting.less';

type Props = {
    isSortDate: boolean;
    searchTerm: string;
    numHits: number;
};

export const SearchSorting = ({ isSortDate, searchTerm, numHits }: Props) => {
    const bem = BEM('search-sorting');
    const [, dispatch] = useSearchContext();

    const setSort = (sort: SearchSort) =>
        dispatch({
            type: ActionType.SetSort,
            sort: sort,
        });

    return (
        <div className={bem()}>
            <div className={bem('selector')}>
                <Normaltekst>{'Sortér etter:'}</Normaltekst>
                <div className={bem('buttons')}>
                    <Radio
                        label={'Beste treff'}
                        name={'search-sorting'}
                        checked={!isSortDate}
                        onChange={() => setSort(SearchSort.BestMatch)}
                        id={'select-sort-best'}
                    />
                    <Radio
                        label={'Dato'}
                        name={'search-sorting'}
                        checked={isSortDate}
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
