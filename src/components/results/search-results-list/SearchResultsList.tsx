import React, { useState } from 'react';
import { SearchHit } from '../search-hit/SearchHit';
import { BodyLong, Button, Heading, Link } from '@navikt/ds-react';
import { quote } from '../../../utils/quote';
import { SearchResultProps } from '../../../types/search-result';
import Config from '../../../config';
import { fetchSearchResultsClientside } from '../../../utils/fetch-search-result';
import { ActionType } from '../../../context/actions';
import { useSearchContext } from '../../../context/ContextProvider';

import style from './SearchResultsList.module.scss';

type Props = {
    result: SearchResultProps;
};

export const SearchResultsList = ({ result }: Props) => {
    const [{ params }, dispatch] = useSearchContext();
    const [isAwaitingMore, setIsAwaitingMore] = useState(false);

    const { word: searchTerm } = result;

    const showMore = async () => {
        setIsAwaitingMore(true);
        const { result: moreHits, error } = await fetchSearchResultsClientside({
            ...params,
            c: result.c + 1,
            start: result.c,
        });
        setIsAwaitingMore(false);

        if (moreHits) {
            dispatch({
                type: ActionType.SetResults,
                result: {
                    ...moreHits,
                    hits: [...result?.hits, ...moreHits.hits],
                },
            });
        }

        if (error) {
            console.error(`Error while fetching more results: ${error}`);
        }
    };

    return (
        <>
            {' '}
            {result.hits?.length > 0 ? (
                result.hits.map((hitProps, index) => (
                    <SearchHit
                        hit={hitProps}
                        hitIndex={index}
                        searchTerm={result.word}
                        key={index}
                    />
                ))
            ) : (
                <div className={style.noHits}>
                    <Heading size="medium" level="2">
                        {`Ingen treff${
                            searchTerm ? ` for ${quote(searchTerm)}` : ''
                        }.`}
                    </Heading>
                    <BodyLong>
                        {
                            'Prøv igjen med mer generelle søkeord, eller forsøk andre søkefiltre. '
                        }
                        <Link href={Config.PATHS.searchTips}>
                            {'Se søketips'}
                        </Link>
                    </BodyLong>
                </div>
            )}
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