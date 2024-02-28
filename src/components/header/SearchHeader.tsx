import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import Config from '../../config';

import style from './SearchHeader.module.scss';

const { keys } = Config.VARS;

type Props = {
    result: SearchResultProps;
};

export const SearchHeader = ({ result }: Props) => {
    const [{ params }, dispatch] = useSearchContext();

    const selectedFacet = result.aggregations.fasetter.buckets.find(
        (f) => f.key === params.f
    );

    const ufNames =
        selectedFacet?.underaggregeringer.buckets
            .filter((uf) => params.uf.includes(uf.key))
            .map((uf) => uf.name) || [];

    const hasSelectedNonDefaultFilters =
        params.f !== keys.defaultFacet ||
        params.uf.length > 0;

    return (
        <div className={style.searchHeader} id={'search-header'}>
            {selectedFacet && (
                <Heading level="2" size="medium" className={style.facet}>
                    {selectedFacet.name}
                </Heading>
            )}{' '}
            {hasSelectedNonDefaultFilters && (
                <BodyLong>
                    {ufNames.length > 0 && (
                        <>
                            {ufNames.map((uf, index) => (
                                <span key={index}>
                                    {`${index ? ', ' : ''}`}
                                    <span
                                        className={style.underFacets}
                                    >{`${uf}`}</span>
                                </span>
                            ))}
                            {' - '}
                        </>
                    )}
                    <Button
                        variant="tertiary"
                        className={style.reset}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: ActionType.ResetFilters });
                        }}
                    >
                        {'Nullstill filter'}
                    </Button>
                </BodyLong>
            )}
        </div>
    );
};
