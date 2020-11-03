import React, { useState } from 'react';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { DaterangeSelector } from './daterange-selector/DaterangeSelector';
import { BEM } from '../../utils/bem';
import Lenke from 'nav-frontend-lenker';
import { SearchResultProps } from '../../types/search-result';
import { NedChevron } from 'nav-frontend-chevron';
import { ActionType } from '../../context/actions';
import { useSearchContext } from '../../context/ContextProvider';
import './SearchFilters.less';

type Props = {
    result: SearchResultProps;
};

export const SearchFilters = ({ result }: Props) => {
    const bem = BEM('search-filters');
    const [, dispatch] = useSearchContext();
    const { fasetter, Tidsperiode } = result.aggregations;
    const [openMobile, setOpenMobile] = useState(false);

    return (
        <div
            className={`${bem()} ${
                openMobile ? bem(undefined, 'visible-mobile') : ''
            }`}
        >
            <Undertittel className={bem('title-desktop')}>
                {'Søkefilter'}
            </Undertittel>
            <Lenke
                href={'#'}
                onClick={(e) => {
                    e.preventDefault();
                    setOpenMobile((state) => !state);
                }}
                className={bem('title-mobile')}
            >
                <Element className={bem('title-mobile-label')}>
                    {'Søkefilter'}
                </Element>
                <Undertekst className={bem('title-mobile-toggle')}>
                    {openMobile ? 'Skjul' : 'Vis'}
                    <NedChevron className={bem('mobile-toggle-chevron')} />
                </Undertekst>
            </Lenke>
            <div className={bem('filters')}>
                {fasetter?.buckets && (
                    <FacetsSelector
                        initialFacet={result.fasett}
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
