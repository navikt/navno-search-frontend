import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import Config from '../../config';

import style from './SearchHeader.module.scss';

const { keys } = Config.VARS;

type Props = {
    result: SearchResultProps;
};

export const SearchHeader = ({ result }: Props) => {
    const [{ params }] = useSearchContext();

    const facetObject = result.aggregations?.fasetter?.buckets?.find(
        (f) => f.key === result.fasettKey
    );
    const underFacetNames =
        facetObject?.underaggregeringer?.buckets
            ?.filter((uf) => uf.checked)
            .map((uf) => uf.name) || [];
    const [, dispatch] = useSearchContext();

    const hasSelectedUnderfacets = underFacetNames.length > 0;

    const hasSelectedNonDefaultFilters =
        params.f !== keys.defaultFacet ||
        params.uf.length > 0 ||
        params.daterange !== keys.defaultDateRange;

    return (
        <div className={style.searchHeader} id={'search-header'}>
            <Heading level="1" size="large">
                {'Søk på nav.no'}
            </Heading>
            <Heading level="2" size="medium" className={style.facet}>
                {result.fasett}
            </Heading>
            {hasSelectedNonDefaultFilters && (
                <BodyLong>
                    {underFacetNames.map((uf, index) => {
                        return (
                            <span key={index}>
                                {`${index ? ' | ' : ''}`}
                                <span className={style.underFacets}>
                                    {`${uf}`}
                                </span>
                            </span>
                        );
                    })}
                    {hasSelectedUnderfacets && ' - '}
                    <Button
                        variant="tertiary"
                        className={style.reset}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: ActionType.ResetFacets });
                        }}
                    >
                        {'Nullstill filter'}
                    </Button>
                </BodyLong>
            )}
        </div>
    );
};
