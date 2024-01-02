import React, { useState } from 'react';
import { AudienceSelector } from './audience-selector/AudienceSelector';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { DaterangeSelector } from './daterange-selector/DaterangeSelector';
import { SearchResultProps } from 'types/search-result';
import { ActionType } from 'context/actions';
import { useSearchContext } from 'context/ContextProvider';
import { classNames } from '../../utils/classnames';
import { Button, Heading } from '@navikt/ds-react';

import { Expand } from '@navikt/ds-icons';
import style from './SearchFilters.module.scss';
import {PreferredLanguageSelector} from "./preferred-language-selector/PreferredLanguageSelector";

type Props = {
    result: SearchResultProps;
};

export const SearchFilters = ({ result }: Props) => {
    const [, dispatch] = useSearchContext();
    const { fasetter, tidsperiode } = result.aggregations;
    const [openMobile, setOpenMobile] = useState(false);

    return (
        <div
            className={classNames(
                style.searchFilters,
                openMobile ? style.visibleMobile : ''
            )}
        >
            <Heading level="2" size="medium" className={style.titleDesktop}>
                {'Søkefilter'}
            </Heading>
            <Button
                variant="tertiary"
                icon={<Expand aria-hidden />}
                iconPosition="right"
                className={style.buttonMobile}
                onClick={(e) => {
                    e.preventDefault();
                    setOpenMobile((state) => !state);
                }}
            >
                {`${openMobile ? 'Skjul' : 'Vis'} søkefilter`}
            </Button>
            <div className={style.filters}>
                <PreferredLanguageSelector
                    setPreferredLanguage={(preferredLanguage) =>
                        dispatch({
                            type: ActionType.SetPreferredLanguage,
                            preferredLanguage: preferredLanguage,
                        })
                    }
                />
                <AudienceSelector
                    setAudience={(audienceToggle) =>
                        dispatch({
                            type: ActionType.SetAudience,
                            audienceToggle: audienceToggle,
                        })
                    }
                />
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
                {tidsperiode && (
                    <DaterangeSelector daterangeProps={tidsperiode} />
                )}
            </div>
        </div>
    );
};
