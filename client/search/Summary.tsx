import { BodyLong, Heading } from '@navikt/ds-react';
import type { SearchResult } from '#shared/types.ts';

export const Summary = ({ result: { word, total } }: { result: SearchResult }) => (
	<div className="sok-summary">
		<Heading size="small" level="2">
			{word ? `${total} treff for «${word}» med valgte søkefilter.` : `${total} treff med valgte søkefilter.`}
		</Heading>
		<BodyLong>Endre søkefilter for å se andre treff.</BodyLong>
	</div>
);
