import React, { useState } from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { FilterRadioPanel } from '../filter-radio-panel/FilterRadioPanel';
import { FacetBucketProps } from '../../../types/search-result';
import { logFilterSelection } from '../../../utils/amplitude';
import { SearchSort } from '../../../types/search-params';
import { UFToggleProps } from '../../../context/reducer';
import config from '../../../config';

type Props = {
    facetsProps: FacetBucketProps[];
    initialFacet: string;
    setFacet: (f: string) => void;
    setUnderFacet: ({ uf, toggle }: UFToggleProps) => void;
    setSorting: (sorting: SearchSort) => void;
};

export const FacetsSelector = ({
    facetsProps,
    initialFacet,
    setFacet,
    setUnderFacet,
    setSorting,
}: Props) => {
    const [currentFacetKey, setCurrentFacetKey] = useState(initialFacet);

    return (
        <FilterSectionPanel>
            {facetsProps.map((facet, fIndex) => {
                const underFacets = facet.underaggregeringer.buckets;
                return (
                    <FilterRadioPanel
                        label={facet.name}
                        count={facet.docCount}
                        isOpen={facet.key === currentFacetKey}
                        onClick={() => {
                            setCurrentFacetKey(facet.key);
                            setFacet(facet.key);
                            if (facet.key === config.VARS.keys.news) {
                                setSorting(SearchSort.Newest);
                            }
                            logFilterSelection(facet.key);
                        }}
                        id={`select-facet-${fIndex}`}
                        key={facet.key}
                    >
                        {underFacets.length > 0 &&
                            underFacets.map((underFacet, ufIndex) => (
                                <FilterOption
                                    label={underFacet.name}
                                    name={underFacet.key}
                                    count={underFacet.docCount}
                                    checked={underFacet.checked}
                                    type={'checkbox'}
                                    onChange={(e) => {
                                        setUnderFacet({
                                            uf: underFacet.key,
                                            toggle: e.target.checked,
                                        });
                                        if (e.target.checked) {
                                            logFilterSelection(
                                                facet.key,
                                                underFacet.key
                                            );
                                        }
                                    }}
                                    key={underFacet.key}
                                    id={`select-uf-${fIndex}-${ufIndex}`}
                                />
                            ))}
                    </FilterRadioPanel>
                );
            })}
        </FilterSectionPanel>
    );
};
