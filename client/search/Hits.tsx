import { Button } from '@navikt/ds-react';
import { BASE_PATH, MAX_PAGE, searchQuery, type SearchParams } from '#shared/search.ts';
import type { SearchResult } from '#shared/types.ts';
import { Hit } from './Hit.tsx';

type Props = {
	result: SearchResult;
	params: SearchParams;
	loadingMore: boolean;
	onShowMore: () => void;
};

export const Hits = ({ result, params, loadingMore, onShowMore }: Props) => (
	<>
		{result.hits.map((hit, index) => (
			// In the API's order, which only grows. Two pages can have the same hit
			// oxlint-disable-next-line react/no-array-index-key
			<Hit key={index} hit={hit} number={index + 1} />
		))}
		{result.isMore && params.page < MAX_PAGE && (
			// A link to the next page, at its first hit, for a browser without JavaScript
			<Button
				as="a"
				// Drops the role="button" Aksel gives a link, which oxlint takes for an invalid role
				// oxlint-disable-next-line jsx-a11y/aria-role
				role={undefined}
				href={`${BASE_PATH}?${searchQuery({ ...params, page: params.page + 1 })}#sok-treff-${result.hits.length + 1}`}
				variant="secondary"
				className="sok-show-more"
				loading={loadingMore}
				onClick={(e) => {
					// A new tab or window gets the link
					if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
						return;
					}
					e.preventDefault();
					onShowMore();
				}}
			>
				Vis flere treff
			</Button>
		)}
	</>
);
