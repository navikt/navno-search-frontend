import React from 'react';
import {
    Innholdstittel,
    Undertekst,
    Undertittel,
} from 'nav-frontend-typografi';
import { SearchResultProps } from '../../types/search-result';
import { BEM } from '../../utils/bem';
import Lenke from 'nav-frontend-lenker';
import './SearchHeader.less';

type Props = {
    results: SearchResultProps;
    clearFilter: () => void;
};

export const SearchHeader = ({ results, clearFilter }: Props) => {
    const bem = BEM('search-header');
    const facetObject = results.aggregations.fasetter.buckets.find(
        (f) => f.key === results.fasett
    );
    const underFacetNames = facetObject.underaggregeringer.buckets
        .filter((uf) => uf.checked)
        .map((uf) => uf.key);

    return (
        <div className={bem()} id={'search-header'}>
            <div>
                <Innholdstittel className={bem('title')}>
                    {'Søk'}
                </Innholdstittel>
                <Undertittel className={bem('facet')}>
                    {results.fasett}
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
                                clearFilter();
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
