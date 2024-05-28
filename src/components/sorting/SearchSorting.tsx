import React from 'react';
import { SearchSort } from 'types/search-params';
import { Config } from 'config';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { Link, Radio, RadioGroup } from '@navikt/ds-react';

import style from './SearchSorting.module.scss';

export const SearchSorting = () => {
    const [{ params }, dispatch] = useSearchContext();

    const { s: sort } = params;

    const setSort = (sort: SearchSort) =>
        dispatch({
            type: ActionType.SetSort,
            sort: sort,
        });

    return (
        <div className={style.searchSorting}>
            <RadioGroup
                legend="Sorter etter:"
                value={sort}
                className={style.selector}
                onChange={(val: SearchSort) => setSort(val)}
            >
                <div className={style.buttons}>
                    <Radio value={SearchSort.BestMatch}>{'Beste treff'}</Radio>
                    <Radio value={SearchSort.Newest}>{'Dato'}</Radio>
                </div>
            </RadioGroup>
            <Link href={Config.PATHS.searchTips} className={style.searchTips}>
                {'Søketips'}
            </Link>
        </div>
    );
};
