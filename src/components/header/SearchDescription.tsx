import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import { BodyLong, BodyShort, Button } from '@navikt/ds-react';
import Config from '../../config';
import { paramToDaterangeKey } from '../../types/search-params';

import style from './SearchDescription.module.scss';

const { keys } = Config.VARS;

type Props = {
    result: SearchResultProps;
};

export const SearchDescription = ({ result }: Props) => {
    const [{ params }, dispatch] = useSearchContext();

    const selectedFacet = result.aggregations.fasetter.buckets.find(
        (f) => f.key === params.f
    );

    const ufNames =
        selectedFacet?.underaggregeringer.buckets
            .filter((uf) => params.uf.includes(uf.key))
            .map((uf) => uf.name) || [];

    const isDefaultDaterange = params.daterange === keys.defaultDateRange;

    const hasSelectedNonDefaultFilters =
        params.f !== keys.defaultFacet ||
        params.uf.length > 0 ||
        !isDefaultDaterange;

    return (
        <div className={style.searchDescription}>
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
                    {!isDefaultDaterange && (
                        <>
                            <BodyShort as={'span'}>
                                {paramToDaterangeKey[params.daterange]}
                            </BodyShort>
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