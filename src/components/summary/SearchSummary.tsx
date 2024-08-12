import React from 'react';
import { BodyLong, Heading, Link } from '@navikt/ds-react';
import { SearchResultProps } from '../../types/search-result';
import { quote } from '../../utils/quote';
import { isInitialDefaultQuery } from '../../utils/isInitialDefaultQuery';
import { useSearchContext } from '../../context/ContextProvider';
import style from './SearchSummary.module.scss';

type Props = {
    result: SearchResultProps;
};

export const SearchSummary = ({ result }: Props) => {
    const { word: searchTerm, didYouMean } = result;

    const [{ params }] = useSearchContext();

    let numHits = result.total;

    return (
        !isInitialDefaultQuery(result, params) && (
            <div className={style.searchSummary}>
                <Heading size="small" level="2">
                    {searchTerm
                        ? `${numHits} treff for ${quote(searchTerm)} med valgte søkefilter.`
                        : `${numHits} treff med valgte søkefilter.`}
                </Heading>
                {didYouMean && (
                    <BodyLong>
                        {'Mente du'}{' '}
                        <Link href={suggestionUrl(didYouMean)}>{didYouMean}</Link>?
                    </BodyLong>
                )}
                <BodyLong>{'Endre søkefilter for å se andre treff.'}</BodyLong>
            </div>
        )
    );
};

const suggestionUrl = (suggestion: string) => {
    let currentUrl = new URL(window.location.href);
    let params = currentUrl.searchParams
    params.set("ord", suggestion)
    return `${currentUrl.pathname}?${params}`
}
