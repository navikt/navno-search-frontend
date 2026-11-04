import { BodyLong, LinkCard } from '@navikt/ds-react';
import parse from 'html-react-parser';
import type { Hit as HitData } from '#shared/types.ts';
import { trackResultClick } from '../analytics.ts';
import { Audience } from './Audience.tsx';
import { Timestamps } from './Timestamps.tsx';

// The API cuts highlights short, often inside a <b>. Parsing closes the tag, where
// writing the string out as it is would leave the rest of the page bold
const highlightOf = (highlight: string) => parse(highlight.replace(/(\r\n|\n|\r)/gm, ''));

// number counts from 1, in the order of the hits; "Vis flere treff" goes on from the next one's id.
// A click anywhere on the card follows its link: Aksel's LinkCard does that once hydrated
export const Hit = ({ hit, number }: { hit: HitData; number: number }) => {
	const { displayName, href, highlight, audience, language } = hit;

	if (!displayName || !href) {
		return null;
	}

	return (
		<LinkCard className="sok-hit">
			<LinkCard.Title>
				<LinkCard.Anchor href={href} id={`sok-treff-${number}`} onClick={() => trackResultClick(displayName, number)}>
					{displayName}
				</LinkCard.Anchor>
			</LinkCard.Title>
			<div className="sok-hit-content">
				{highlight && <BodyLong className="sok-hit-highlight">{highlightOf(highlight)}</BodyLong>}
				<div className="sok-hit-footer">
					{audience && <Audience audience={audience} language={language} />}
					<Timestamps hit={hit} />
				</div>
			</div>
		</LinkCard>
	);
};
