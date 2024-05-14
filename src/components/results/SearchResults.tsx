import React from 'react';
import { SearchResultProps } from 'types/search-result';
import { useSearchContext } from 'context/ContextProvider';
import { SearchResultsList } from './search-results-list/SearchResultsList';
import { SearchResultsEmpty } from './search-results-empty/SearchResultsEmpty';
import { isInitialDefaultQuery } from '../../utils/isInitialDefaultQuery';

import style from './SearchResults.module.scss';
import { Button } from '@navikt/ds-react';
import { Expand } from '@navikt/ds-icons';

type Props = {
    result: SearchResultProps;
    showFiltersMobile: boolean;
    showFiltersHandler: (e: React.MouseEvent<HTMLElement>) => void;
};

export const SearchResults = ({ result, showFiltersMobile, showFiltersHandler }: Props) => {
    const [{ params }] = useSearchContext();

    return (
        <div className={style.searchResults}>
            {isInitialDefaultQuery(result, params) ? (
                <SearchResultsEmpty />
            ) : (
                <SearchResultsList result={result} />
            )}
            <Button
                variant="tertiary"
                icon={<Expand aria-hidden />}
                iconPosition="right"
                className={style.buttonMobile}
                onClick={showFiltersHandler}
            >
                {`${showFiltersMobile ? 'Skjul' : 'Vis'} søkefilter`}
            </Button>
        </div>
    );
};
