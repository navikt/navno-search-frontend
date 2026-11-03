import { Search } from '@navikt/ds-react';

type Props = {
	ord: string;
	onChange: (ord: string) => void;
};

// role="search" goes here rather than on the form, so the hits stay out of the search landmark
export const SearchField = ({ ord, onChange }: Props) => (
	<div role="search" className="sok-search-field">
		<Search
			name="ord"
			value={ord.slice(0, 100)}
			onChange={onChange}
			label="Søk på siden"
			variant="primary"
			hideLabel
			maxLength={100}
			id="search-input"
			autoComplete="off"
		/>
	</div>
);
