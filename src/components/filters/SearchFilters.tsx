import { Undertekst, Undertittel, Element } from 'nav-frontend-typografi';
import { FacetsSelector } from './facets-selector/FacetsSelector';
import { DaterangeSelector } from './daterange-selector/DaterangeSelector';
import React, { useState } from 'react';
import { BEM } from '../../utils/bem';
import Lenke from 'nav-frontend-lenker';
import { DaterangeProps, FacetBucketProps } from '../../types/search-result';
import './SearchFilters.less';

export type UFSetterProps = {
    underFacet: string;
    toggle: boolean;
};

type Props = {
    daterangeProps: DaterangeProps;
    facetsProps: FacetBucketProps[];
    setFacet: (f: number) => void;
    setUnderFacet: (props: UFSetterProps) => void;
    setDaterange: (daterange: number) => void;
};

export const SearchFilters = ({
    daterangeProps,
    facetsProps,
    setFacet,
    setUnderFacet,
    setDaterange,
}: Props) => {
    const bem = BEM('search-filters');
    const [openMobile, setOpenMobile] = useState(false);

    return (
        <div
            className={`${bem()} ${
                openMobile ? bem(undefined, 'visible-mobile') : ''
            }`}
        >
            <Undertittel className={bem('title')}>{'Søkefilter'}</Undertittel>
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
                    facetsProps={facetsProps}
                    setFacet={setFacet}
                    setUnderFacet={setUnderFacet}
                />
                <DaterangeSelector
                    daterangeProps={daterangeProps}
                    setDaterange={setDaterange}
                />
            </div>
        </div>
    );
};
