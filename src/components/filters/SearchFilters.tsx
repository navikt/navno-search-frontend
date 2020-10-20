import React, { useState } from 'react';
import { Undertekst, Undertittel, Element } from 'nav-frontend-typografi';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { DaterangeSelector } from './daterange-selector/DaterangeSelector';
import { BEM } from '../../utils/bem';
import Lenke from 'nav-frontend-lenker';
import { SearchResultProps } from '../../types/search-result';
import './SearchFilters.less';

export type UFSetterProps = {
    uf: string;
    toggle: boolean;
};

type Props = {
    results: SearchResultProps;
    setFacet: (f: number) => void;
    setUnderFacet: (props: UFSetterProps) => void;
    setDaterange: (daterange: number) => void;
};

export const SearchFilters = ({
    results,
    setFacet,
    setUnderFacet,
    setDaterange,
}: Props) => {
    const bem = BEM('search-filters');
    const [openMobile, setOpenMobile] = useState(false);
    const { fasetter, Tidsperiode } = results.aggregations;

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
                href={''}
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
                    {openMobile ? 'Skjul filter' : 'Vis filter'}
                </Undertekst>
            </Lenke>
            <div className={bem('filters')}>
                <FacetsSelector
                    initialFacet={results.fasett}
                    facetsProps={fasetter.buckets}
                    setFacet={setFacet}
                    setUnderFacet={setUnderFacet}
                />
                <DaterangeSelector
                    daterangeProps={Tidsperiode}
                    setDaterange={setDaterange}
                />
            </div>
        </div>
    );
};
