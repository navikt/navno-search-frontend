import React, { useState } from 'react';
import { SearchHit } from '../search-hit/SearchHit';
import { Button } from '@navikt/ds-react';
import { SearchResultProps } from '../../../types/search-result';
import { fetchSearchResultsClientside } from '../../../utils/fetch-search-result';
import { ActionType } from '../../../context/actions';
import { useSearchContext } from '../../../context/ContextProvider';

import style from './SearchResultsList.module.scss';
import { logShowMore } from '../../../utils/amplitude';

type Props = {
    result: SearchResultProps;
};

export const SearchResultsList = ({ result }: Props) => {
    const [{ params }, dispatch] = useSearchContext();
    const [isAwaitingMore, setIsAwaitingMore] = useState(false);

    const showMore = async () => {
        const nextPage = result.page + 1;

        logShowMore(nextPage);

        setIsAwaitingMore(true);
        const { result: moreHits, error } = await fetchSearchResultsClientside({
            ...params,
            page: nextPage,
        });
        setIsAwaitingMore(false);

        if (moreHits) {
            dispatch({
                type: ActionType.SetResults,
                result: {
                    ...moreHits,
                    hits: [...result.hits, ...moreHits.hits],
                },
            });
        }

        if (error) {
            console.error(`Error while fetching more results: ${error}`);
        }
    };

    const numHits = result.hits?.length;

    return (
        <>
            {numHits > 0 &&
                result.hits.map((hitProps, index) => {
                    const key = `${hitProps.href}-${hitProps.displayName}`;

                    return (
                        <SearchHit hit={hitProps} hitIndex={index} key={key} />
                    );
                })}
            {result.isMore && (
                <Button
                    variant={'secondary'}
                    onClick={showMore}
                    className={style.showMore}
                    loading={isAwaitingMore}
                >
                    {'Vis flere treff'}
                </Button>
            )}
        </>
    );
};
