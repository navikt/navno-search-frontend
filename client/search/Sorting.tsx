import { Link, Radio, RadioGroup } from '@navikt/ds-react';
import type { SearchParams } from '#shared/search.ts';

type Props = {
	s: SearchParams['s'];
	onChange: (s: SearchParams['s']) => void;
};

export const Sorting = ({ s, onChange }: Props) => (
	<div className="sok-sorting">
		<RadioGroup legend="Sorter etter:" name="s" value={s} onChange={onChange} className="sok-sorting-group">
			<div className="sok-sorting-options">
				<Radio value="0" id="sok-s-0">
					Beste treff
				</Radio>
				<Radio value="1" id="sok-s-1">
					Dato
				</Radio>
			</div>
		</RadioGroup>
		<Link href="/soketips" className="sok-search-tips">
			Søketips
		</Link>
	</div>
);
