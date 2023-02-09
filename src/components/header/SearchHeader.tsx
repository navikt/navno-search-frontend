import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyLong, Button, Heading } from '@navikt/ds-react';

import style from './SearchHeader.module.scss';

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
                <BodyLong>
                    {underFacetNames.map(
                        (uf, index) => {
                            return (
                                <>
                                    {`${index ? ' | ' : ''}`}
                                    <span className={style.underFacets}>
                                        {`${uf}`}
                                    </span>
                                </>
                            );
                        })
                    }
                    {' - '}
                    <Button
                        variant="tertiary"
                        className={style.resetUnderFacets}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: ActionType.ResetUnderfacets });
                        }}
                    >
                        {'Nullstill filter'}
                    </Button>
                </BodyLong>
            )}
        </div>
    );
};
