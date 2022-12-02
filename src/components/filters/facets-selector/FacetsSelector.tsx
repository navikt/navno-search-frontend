import React, { useState } from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { FilterRadioPanel } from '../filter-radio-panel/FilterRadioPanel';
import { FacetBucketProps } from '../../../types/search-result';
import { logFilterSelection } from '../../../utils/amplitude';
import { SearchSort } from '../../../types/search-params';
import { UFToggleProps } from '../../../context/reducer';

const sortFacets = (facets: FacetBucketProps[]) =>
    facets.sort((a, b) => a.displayIndex - b.displayIndex);

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
    const [currentFacetKey, setCurrentFacetKey] = useState(initialFacet);

    return (
        <FilterSectionPanel>
            {sortFacets(facetsProps).map((facet) => {
                const underFacets = facet.underaggregeringer.buckets;
                const fIndex = facet.index;

                return (
                    <FilterRadioPanel
                        label={facet.key}
                        count={facet.docCount}
                        isOpen={facet.key === currentFacetKey}
                        onClick={() => {
                            setCurrentFacetKey(facet.key);
                            setFacet(fIndex);
                            if (facet.key === 'Nyheter') {
                                setSorting(SearchSort.Newest);
                            }
                            logFilterSelection(facet.key);
                        }}
                        id={`select-facet-${fIndex}`}
                        key={facet.key}
                    >
                        {sortFacets(underFacets).map((underFacet) => {
                            const ufIndex = underFacet.index;

                            return (
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
                            );
                        })}
                    </FilterRadioPanel>
                );
            })}
        </FilterSectionPanel>
    );
};
