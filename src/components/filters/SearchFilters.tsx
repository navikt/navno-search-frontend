import React from 'react';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { SearchResultProps } from 'types/search-result';
import { ActionType } from 'context/actions';
import { useSearchContext } from 'context/ContextProvider';
import { classNames } from '../../utils/classnames';
import { Heading } from '@navikt/ds-react';
import style from './SearchFilters.module.scss';
import { PreferredLanguageSelector } from './preferred-language-selector/PreferredLanguageSelector';

type Props = {
    result: SearchResultProps;
    showFiltersMobile: boolean;
};

export const SearchFilters = ({ result, showFiltersMobile }: Props) => {
    const [, dispatch] = useSearchContext();
    const { fasetter } = result.aggregations;

    return (
        <div
            className={classNames(
                style.searchFilters,
                showFiltersMobile ? style.visibleMobile : ''
            )}
        >
            <Heading level="2" size="medium" className={style.titleDesktop}>
                {'Søkefilter'}
            </Heading>
            <div className={style.filters}>
                {fasetter?.buckets && (
                    <FacetsSelector
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
                <PreferredLanguageSelector
                    setPreferredLanguage={(preferredLanguage) =>
                        dispatch({
                            type: ActionType.SetPreferredLanguage,
                            preferredLanguage: preferredLanguage,
                        })
                    }
                />
            </div>
        </div>
    );
};
