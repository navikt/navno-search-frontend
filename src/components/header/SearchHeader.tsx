import React from 'react';
import {
    Innholdstittel,
    Undertekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { SearchResultProps } from '../../types/search-result';
import { BEM } from '../../utils/bem';
import Lenke from 'nav-frontend-lenker';
import { useSearchContext } from '../../context/ContextProvider';
import { ActionType } from '../../context/actions';
import './SearchHeader.less';

type Props = {
    result: SearchResultProps;
};

export const SearchHeader = ({ result }: Props) => {
    const bem = BEM('search-header');
    const facetObject = result.aggregations?.fasetter?.buckets?.find(
        (f) => f.key === result.fasettKey
    );
    const underFacetNames = facetObject?.underaggregeringer?.buckets
        ?.filter((uf) => uf.checked)
        .map((uf) => uf.key);
    const [, dispatch] = useSearchContext();

    return (
        <div className={bem()} id={'search-header'}>
            <div>
                <Innholdstittel className={bem('title')}>
                    {'Søk på nav.no'}
                </Innholdstittel>
                <Undertittel className={bem('facet')}>
                    {result.fasett}
                </Undertittel>
                {underFacetNames?.length > 0 && (
                    <Undertekst className={bem('under-facets')}>
                        {underFacetNames.map(
                            (uf, index) => `${index ? ' | ' : ''}${uf}`
                        )}
                        {' - '}
                        <Lenke
                            href={'#'}
                            className={bem('clear-uf')}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch({ type: ActionType.ClearUnderfacets });
                            }}
                        >
                            {'Nullstill filter'}
                        </Lenke>
                    </Undertekst>
                )}
            </div>
        </div>
    );
};
