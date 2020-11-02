import React, { useState } from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { FilterRadioPanel } from '../filter-radio-panel/FilterRadioPanel';
import { FacetBucketProps } from '../../../types/search-result';
import { logFilterSelection } from '../../../utils/amplitude';
import { SearchSort } from '../../../types/search-params';
import { UFToggleProps } from '../../../context/reducer';

type Props = {
    facetsProps: FacetBucketProps[];
    initialFacet: string;
    setFacet: (f: number) => void;
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
    const [currentFacet, setCurrentFacet] = useState(initialFacet);

    return (
        <FilterSectionPanel>
            {facetsProps.map((facet, fIndex) => {
                const underFacets = facet.underaggregeringer.buckets;
                return (
                    <FilterRadioPanel
                        label={facet.key}
                        count={facet.docCount}
                        isOpen={facet.key === currentFacet}
                        onClick={() => {
                            setCurrentFacet(facet.key);
                            setFacet(fIndex);
                            if (facet.key === 'Nyheter') {
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
                                    label={underFacet.key}
                                    name={facet.key}
                                    count={underFacet.docCount}
                                    checked={underFacet.checked}
                                    type={'checkbox'}
                                    onChange={(e) => {
                                        setUnderFacet({
                                            uf: ufIndex,
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
