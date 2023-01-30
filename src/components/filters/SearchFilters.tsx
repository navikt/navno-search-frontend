import React, { useState } from 'react';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { DaterangeSelector } from './daterange-selector/DaterangeSelector';
import { SearchResultProps } from 'types/search-result';
import { ActionType } from 'context/actions';
import { useSearchContext } from 'context/ContextProvider';
import classNames from 'classnames';
import { BodyShort, Heading, Label, Link } from '@navikt/ds-react';
import { Collapse, Expand } from '@navikt/ds-icons';

import style from './SearchFilters.module.scss';

type Props = {
    result: SearchResultProps;
};

export const SearchFilters = ({ result }: Props) => {
    const [, dispatch] = useSearchContext();
    const { fasetter, Tidsperiode } = result.aggregations;
    const [openMobile, setOpenMobile] = useState(false);

    return (
        <div
            className={classNames( style.searchFilters,
                openMobile ? style.visibleMobile : ''
            )}
        >
            <Heading level="2" size="medium" className={style.titleDesktop}>
                {'Søkefilter'}
            </Heading>
            <Link
                href={'#'}
                onClick={(e) => {
                    e.preventDefault();
                    setOpenMobile((state) => !state);
                }}
                className={style.titleMobile}
            >
                <Label className={style.titleMobileLabel}>
                    {'Søkefilter'}
                </Label>
                <BodyShort size="small" className={style.titleMobileToggle}>
                    (openMobile ?
                        {'Skjul'}
                        <Collapse className={style.mobileToggleChevron} />
                    :
                        {'Vis'}
                        <Expand className={style.mobileToggleChevron} />
                    )
                </BodyShort>
            </Link>
            <div className={style.filters}>
                {fasetter?.buckets && (
                    <FacetsSelector
                        initialFacet={result.fasettKey}
                        facetsProps={fasetter.buckets}
                        setFacet={(facet) =>
                            dispatch({
                                type: ActionType.SetFacet,
                                facet: facet,
                            })
                        }
                        setUnderFacet={(ufToggle) =>
                            dispatch({
                                type: ActionType.SetUnderfacet,
                                underfacetToggle: ufToggle,
                            })
                        }
                        setSorting={(sort) =>
                            dispatch({
                                type: ActionType.SetSort,
                                sort: sort,
                            })
                        }
                    />
                )}
                {Tidsperiode && (
                    <DaterangeSelector
                        daterangeProps={Tidsperiode}
                        setDaterange={(daterangeKey) =>
                            dispatch({
                                type: ActionType.SetDaterange,
                                daterangeKey: daterangeKey,
                            })
                        }
                    />
                )}
            </div>
        </div>
    );
};
