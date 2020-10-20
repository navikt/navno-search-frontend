import React, { useState } from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { FilterRadioPanel } from '../filter-radio-panel/FilterRadioPanel';
import { FacetBucketProps } from '../../../types/search-result';
import { SearchParams } from '../../../types/search-params';
import { UFSetterProps } from '../SearchFilters';

type Props = {
    facetsProps: FacetBucketProps[];
    initialFacet: string;
    setFacet: (f: SearchParams['f']) => void;
    setUnderFacet: ({ uf, toggle }: UFSetterProps) => void;
};

export const FacetsSelector = ({
    facetsProps,
    initialFacet,
    setFacet,
    setUnderFacet,
}: Props) => {
    const [currentFacet, setCurrentFacet] = useState(initialFacet);

    return (
        <FilterSectionPanel>
            {facetsProps.map((facet, index) => {
                const underFacets = facet.underaggregeringer.buckets;
                return (
                    <FilterRadioPanel
                        label={facet.key}
                        count={facet.docCount}
                        isOpen={facet.key === currentFacet}
                        onClick={() => {
                            setCurrentFacet(facet.key);
                            setFacet(index);
                        }}
                        key={facet.key}
                    >
                        {underFacets.length > 0 &&
                            underFacets.map((underFacet, index) => (
                                <FilterOption
                                    label={underFacet.key}
                                    name={facet.key}
                                    count={underFacet.docCount}
                                    checked={underFacet.checked}
                                    type={'checkbox'}
                                    onChange={(e) =>
                                        setUnderFacet({
                                            uf: String(index),
                                            toggle: e.target.checked,
                                        })
                                    }
                                    key={underFacet.key}
                                />
                            ))}
                    </FilterRadioPanel>
                );
            })}
        </FilterSectionPanel>
    );
};
