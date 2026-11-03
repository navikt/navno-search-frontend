import { Heading, LocalAlert } from '@navikt/ds-react';
import { useEffect } from 'react';
import { BASE_PATH } from '#shared/search.ts';
import { trackFilter, trackShowMore } from '../analytics.ts';
import { useSearch, type Initial } from '../useSearch.ts';
import { Filters } from './Filters.tsx';
import { Hits } from './Hits.tsx';
import { SearchField } from './SearchField.tsx';
import { Sorting } from './Sorting.tsx';
import { Spinner } from './Spinner.tsx';
import { Summary } from './Summary.tsx';

export const Unavailable = () => (
	<LocalAlert role="alert" status="error">
		Feil - søketjenesten er ikke tilgjengelig
	</LocalAlert>
);

// The page is one GET form, the grid too, so it works before the app hydrates and without
// JavaScript. Once hydrated, the app searches in place
export const SearchPage = ({ initial }: { initial: Initial }) => {
	const search = useSearch(initial);
	const { params, result, landing, loading, loadingMore, failed, firstNew } = search;

	// So a keyboard continues from the hits "Vis flere treff" added
	useEffect(() => {
		if (firstNew) {
			document.getElementById(`sok-treff-${firstNew}`)?.focus();
		}
	}, [firstNew]);

	const results = () => {
		if (failed) {
			return <Unavailable />;
		}
		if (loading) {
			return <Spinner />;
		}
		if (landing) {
			return null;
		}
		return (
			<Hits
				result={result}
				params={params}
				loadingMore={loadingMore}
				onShowMore={() => {
					trackShowMore(params.page + 1);
					search.showMore();
				}}
			/>
		);
	};

	return (
		<form
			className="sok-page"
			method="get"
			action={BASE_PATH}
			autoComplete="off"
			onSubmit={(e) => {
				e.preventDefault();
				// Closes the keyboard on a phone
				(document.activeElement as HTMLElement | null)?.blur();
				search.search();
			}}
		>
			<Heading className="sok-heading" level="1" size="large">
				Søk på nav.no
			</Heading>
			<SearchField ord={params.ord} onChange={search.setOrd} />
			<Sorting s={params.s} onChange={(s) => search.search({ s })} />
			{!landing && !failed && <Summary result={result} />}
			{result.aggregations && (
				<Filters
					result={result}
					params={params}
					onFacet={(f) => {
						trackFilter(f);
						search.search({ f, uf: [] });
					}}
					onUnderfacet={(key, checked) => {
						if (checked) {
							trackFilter(params.f, key);
						}
						search.search({ uf: checked ? [...params.uf, key] : params.uf.filter((uf) => uf !== key) });
					}}
					onLanguage={(preferredLanguage) => {
						trackFilter(preferredLanguage);
						search.search({ preferredLanguage });
					}}
				/>
			)}
			<div className="sok-results">{results()}</div>
		</form>
	);
};
