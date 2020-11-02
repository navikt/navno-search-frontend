import React, { useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { SearchHit } from './search-hit/SearchHit';
import { BEM } from '../../utils/bem';
import { Knapp } from 'nav-frontend-knapper';
import { SearchResultProps } from '../../types/search-result';
import { fetchSearchResultsClientside } from '../../utils/fetch-search-result';
import { quote } from '../../utils/quote';
import Lenke from 'nav-frontend-lenker';
import { Config } from '../../config';
import { useSearchContext } from '../../context/ContextProvider';
import { ActionType } from '../../context/actions';
import './SearchResults.less';

type Props = {
    result: SearchResultProps;
};

export const SearchResults = ({ result }: Props) => {
    const bem = BEM('search-results');

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
        <div className={bem()}>
            {result.hits?.length > 0 ? (
                result.hits.map((hitProps, index) => (
                    <SearchHit
                        hit={hitProps}
                        searchTerm={result.word}
                        key={index}
                    />
                ))
            ) : (
                <div className={bem('no-hits')}>
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
                </div>
            )}
            {result.isMore && (
                <Knapp
                    onClick={showMore}
                    className={bem('show-more')}
                    spinner={isAwaitingMore}
                    disabled={isAwaitingMore}
                >
                    <Undertittel>
                        {isAwaitingMore
                            ? 'Henter flere treff...'
                            : 'Vis flere treff'}
                    </Undertittel>
                </Knapp>
            )}
        </div>
    );
};
