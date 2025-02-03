import React from 'react';
import { UFToggleProps } from 'context/reducer';
import { useSearchContext } from 'context/ContextProvider';
import { FacetBucketProps } from 'types/search-result';
import { logFilterSelection } from 'utils/analytics';
import { FilterOption } from '../filter-section-panel/FilterOption';
import { FilterRadioPanel } from '../filter-radio-panel/FilterRadioPanel';

export type FacetsSelectorProps = {
    facetsProps: FacetBucketProps[];
    setFacet: (f: string) => void;
    setUnderFacet: ({ uf, toggle }: UFToggleProps) => void;
};

export const FacetsSelector = ({
    facetsProps,
    setFacet,
    setUnderFacet,
}: FacetsSelectorProps) => {
    const [{ params }] = useSearchContext();

    return (
        <div>
            {facetsProps.map((facet, fIndex) => {
                const underFacets = facet.underaggregeringer.buckets;
                return (
                    <FilterRadioPanel
                        label={facet.name}
                        count={facet.docCount}
                        isOpen={facet.key === params.f}
                        onClick={() => {
                            setFacet(facet.key);
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
                                    checked={params.uf?.includes(
                                        underFacet.key
                                    )}
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
        </div>
    );
};
