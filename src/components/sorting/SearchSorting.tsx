import React from 'react';
import { SearchSort } from 'types/search-params';
import { Config } from 'config';
import { quote } from 'utils/quote';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyShort, Link, Radio, RadioGroup } from '@navikt/ds-react';
import { SearchResultProps } from '../../types/search-result';
import { isInitialDefaultQuery } from '../../utils/isInitialDefaultQuery';

import style from './SearchSorting.module.scss';

type Props = {
    result: SearchResultProps;
};

export const SearchSorting = ({ result }: Props) => {
    const { word, total } = result;
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
                {!isInitialDefaultQuery(result, params) && (
                    <BodyShort aria-live={'polite'} className={style.hits}>
                        {`${total} treff`}
                        {word && (
                            <span className={style.hitsVerbose}>
                                {' for '}
                                <span className={style.term}>
                                    {quote(word)}
                                </span>
                            </span>
                        )}
                    </BodyShort>
                )}
            </div>
        </div>
    );
};
