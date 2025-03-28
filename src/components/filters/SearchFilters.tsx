import React, { useState } from 'react';
import { Box, Button, Heading } from '@navikt/ds-react';
import { ChevronDownIcon, FilterIcon } from '@navikt/aksel-icons';
import { SearchResultProps } from 'types/search-result';
import { ActionType } from 'context/actions';
import { useSearchContext } from 'context/ContextProvider';
import { classNames } from 'utils/classnames';
import { PreferredLanguageSelector } from './preferred-language-selector/PreferredLanguageSelector';
import { FacetsSelector } from './facets-selector/FacetsSelector';

import style from './SearchFilters.module.scss';

type Props = {
    result: SearchResultProps;
    className?: string;
};

export const SearchFilters = ({ result, className = '' }: Props) => {
    const [{ params }, dispatch] = useSearchContext();
    const { fasetter } = result.aggregations;
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    const selectedFacet = result.aggregations.fasetter.buckets.find(
        (f) => f.key === params.f
    );

    return (
        <div className={classNames(style.searchFilterWrapper, className)}>
            <Button
                variant="tertiary"
                icon={<ChevronDownIcon aria-hidden />}
                iconPosition={'right'}
                className={style.buttonMobile}
                onClick={(e) => {
                    e.preventDefault();
                    setShowFiltersMobile((state) => !state);
                }}
            >
                <FilterIcon aria-hidden />
                {`Søkefilter: ${selectedFacet?.name}`}{' '}
            </Button>

            <Box
                className={classNames(
                    style.searchFilters,
                    showFiltersMobile ? style.visibleMobile : ''
                )}
                padding={'4'}
                borderColor={'border-subtle'}
                borderWidth={'1'}
                borderRadius={'medium'}
                data-testid="search-filter-panel"
            >
                <Heading level="3" size="small" className={style.titleDesktop}>
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
            </Box>
        </div>
    );
};
