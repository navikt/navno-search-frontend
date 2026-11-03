import { Label, Loader } from '@navikt/ds-react';

// In place of the hits while a search runs
export const Spinner = () => (
	<div className="sok-spinner" role="status">
		<Label>Henter søkeresultater...</Label>
		<Loader size="2xlarge" className="sok-spinner-loader" />
	</div>
);
