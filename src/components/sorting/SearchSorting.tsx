import React from 'react';
import { SearchSort } from 'types/search-params';
import { Config } from 'config';
import { quote } from 'utils/quote';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyShort, Link, Radio, RadioGroup } from '@navikt/ds-react';

import style from './SearchSorting.module.scss';

type Props = {
    searchTerm: string;
    numHitsTotal: number;
};

export const SearchSorting = ({ searchTerm, numHitsTotal }: Props) => {
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
            <div className={style.hitsAndTips}>
                <Link href={Config.PATHS.searchTips}>{'Søketips'}</Link>
                {searchTerm && (
                    <BodyShort aria-live={'polite'} className={style.hits}>
                        {`${numHitsTotal} treff`}
                        <span className={style.hitsVerbose}>
                            {' for '}
                            <span className={style.term}>
                                {quote(searchTerm)}
                            </span>
                        </span>
                    </BodyShort>
                )}
            </div>
        </div>
    );
};
