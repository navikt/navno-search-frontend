import React, { useState } from 'react';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { SearchResultProps } from 'types/search-result';
import { ActionType } from 'context/actions';
import { useSearchContext } from 'context/ContextProvider';
import { classNames } from '../../utils/classnames';
import { Box, Button, Heading } from '@navikt/ds-react';
import style from './SearchFilters.module.scss';
import { PreferredLanguageSelector } from './preferred-language-selector/PreferredLanguageSelector';
import { ChevronDownIcon, FilterIcon } from '@navikt/aksel-icons';

type Props = {
    result: SearchResultProps;
    className: string;
};

export const SearchFilters = ({ result, className }: Props) => {
    const [, dispatch] = useSearchContext();
    const { fasetter } = result.aggregations;
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    return (
        <div className={classNames(style.searchFilterWrapper, className)}>
            <Button
                variant="tertiary"
                icon={<ChevronDownIcon aria-hidden />}
                iconPosition={"right"}
                className={style.buttonMobile}
                onClick={(e) => {
                    e.preventDefault();
                    setShowFiltersMobile(!showFiltersMobile);
                }}
            >
                <FilterIcon aria-hidden/>
                {`Søkefilter`}{' '}
            </Button>

            <Box
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
        </Box>
        </div>
    );
};
