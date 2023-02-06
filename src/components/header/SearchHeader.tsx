import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';

import style from './SearchHeader.module.scss';
import { Button, Heading } from '@navikt/ds-react';

type Props = {
    result: SearchResultProps;
};

export const SearchHeader = ({ result }: Props) => {
    const facetObject = result.aggregations?.fasetter?.buckets?.find(
        (f) => f.key === result.fasettKey
    );
    const underFacetNames = facetObject?.underaggregeringer?.buckets
        ?.filter((uf) => uf.checked)
        .map((uf) => uf.name);
    const [, dispatch] = useSearchContext();

    return (
        <div className={style.searchHeader} id={'search-header'}>
            <Heading level="1" size="large">
                {'Søk på nav.no'}
            </Heading>
            <Heading level="2" size="medium" className={style.facet}>
                {result.fasett}
            </Heading>
            {underFacetNames?.length > 0 && (
                <span className={style.underFacets}>
                    {underFacetNames.map(
                        (uf, index) => `${index ? ' | ' : ''}${uf}`
                    )}
                    {' - '}
                    <Button
                        variant="tertiary"
                        className={style.clearUf}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: ActionType.ClearUnderfacets });
                        }}
                    >
                        {'Nullstill filter'}
                    </Button>
                </span>
            )}
        </div>
    );
};
