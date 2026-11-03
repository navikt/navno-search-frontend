import { ChevronDownIcon, FilterIcon } from '@navikt/aksel-icons';
import { Box, Button, Checkbox, Heading, Radio, RadioGroup } from '@navikt/ds-react';
import { useState } from 'react';
import type { SearchParams } from '#shared/search.ts';
import type { Bucket, SearchResult } from '#shared/types.ts';

type FacetProps = {
	facet: Bucket;
	params: SearchParams;
	onUnderfacet: (key: string, checked: boolean) => void;
};

// The chosen facet's underfacets show under it
const Facet = ({ facet, params, onUnderfacet }: FacetProps) => {
	const underfacets = facet.underaggregeringer?.buckets ?? [];

	return (
		<div className="sok-facet">
			<div className="sok-facet-option">
				<Radio value={facet.key} id={`sok-f-${facet.key}`}>
					{facet.name}
				</Radio>
				<span className="sok-count">{facet.docCount}</span>
			</div>
			{facet.key === params.f && underfacets.length > 0 && (
				<div className="sok-underfacets">
					{underfacets.map((underfacet) => (
						<div className="sok-underfacet" key={underfacet.key}>
							<Checkbox
								name="uf"
								value={underfacet.key}
								id={`sok-uf-${underfacet.key}`}
								checked={params.uf.includes(underfacet.key)}
								onChange={(e) => onUnderfacet(underfacet.key, e.target.checked)}
							>
								{underfacet.name}
							</Checkbox>
							<span className="sok-count">{underfacet.docCount}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

type Props = {
	result: SearchResult;
	params: SearchParams;
	onFacet: (f: string) => void;
	onUnderfacet: (key: string, checked: boolean) => void;
	onLanguage: (preferredLanguage: string) => void;
};

export const Filters = ({ result, params, onFacet, onUnderfacet, onLanguage }: Props) => {
	// Only on a phone, where the filters start out closed
	const [open, setOpen] = useState(false);
	const facets = result.aggregations.fasetter.buckets;
	const chosen = facets.find((facet) => facet.key === params.f);

	return (
		<div className="sok-filter-wrapper">
			<Button
				type="button"
				variant="tertiary"
				icon={<ChevronDownIcon aria-hidden />}
				iconPosition="right"
				className="sok-filter-toggle"
				aria-expanded={open}
				aria-controls="sok-filter-panel"
				onClick={() => setOpen(!open)}
			>
				<FilterIcon aria-hidden />
				{`Søkefilter: ${chosen?.name ?? ''}`}{' '}
			</Button>
			<Box
				id="sok-filter-panel"
				className={open ? 'sok-filter-panel sok-filter-panel--open' : 'sok-filter-panel'}
				padding="space-16"
				borderColor="neutral-subtle"
				borderWidth="1"
				borderRadius="4"
			>
				<Heading level="3" size="small" className="sok-filter-title">
					Søkefilter
				</Heading>
				<div className="sok-filters">
					<RadioGroup legend="Søkefilter" hideLegend name="f" value={params.f} onChange={onFacet}>
						{facets.map((facet) => (
							<Facet key={facet.key} facet={facet} params={params} onUnderfacet={onUnderfacet} />
						))}
					</RadioGroup>
					<Heading level="3" size="small">
						Foretrukket språk
					</Heading>
					<RadioGroup
						legend="Foretrukket språk"
						hideLegend
						name="preferredLanguage"
						value={params.preferredLanguage}
						onChange={onLanguage}
					>
						<Radio value="nb" id="sok-lang-nb">
							Bokmål
						</Radio>
						<Radio value="nn" id="sok-lang-nn">
							Nynorsk
						</Radio>
						<Radio value="en" id="sok-lang-en">
							English
						</Radio>
					</RadioGroup>
				</div>
			</Box>
		</div>
	);
};
