import React, { useState } from 'react';
import { SearchHit } from './search-hit/SearchHit';
import { SearchResultProps } from 'types/search-result';
import { fetchSearchResultsClientside } from 'utils/fetch-search-result';
import { quote } from 'utils/quote';
import { Config } from 'config';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';

import style from './SearchResults.module.scss';
import { BodyLong, Button, Heading, Link } from '@navikt/ds-react';

type Props = {
    result: SearchResultProps;
};

export const SearchResults = ({ result }: Props) => {
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
        <div className={style.searchResults}>
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
                (isAwaitingMore
                    ?
                        <Button
                            className={style.showMore}
                            loading
                        >
                            {'Henter flere treff...'}
                        </Button>
                    :
                        <Button
                            className={style.showMore}
                            variant="secondary"
                            onClick={showMore}
                        >
                            {'Vis flere treff'}
                        </Button>
                )
            )}
        </div>
    );
};
