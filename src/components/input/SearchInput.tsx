import React, { useState } from 'react';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import Cookies from 'js-cookie';
import { Search } from '@navikt/ds-react';

import style from './SearchInput.module.scss';

const setSubmitTrackerCookie = () => {
    Cookies.set('nav-search-use', Date.now().toString(), {
        expires: 30,
        domain: '.nav.no',
    });
};

type Props = {
    initialSearchTerm: string;
    fetchNewResults: () => void;
};

export const SearchInput = ({ initialSearchTerm, fetchNewResults }: Props) => {
    const [inputValue, _setInputValue] = useState(
        initialSearchTerm.slice(0, 100)
    );
    const [, dispatch] = useSearchContext();
    const setInputValue = (value: string) => {
        _setInputValue(value);
        dispatch({
            type: ActionType.SetSearchTerm,
            searchTerm: value,
        });
    };

    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                // remove focus to close on-screen keyboards etc
                (document.activeElement as HTMLElement)?.blur?.();
                fetchNewResults();
                setSubmitTrackerCookie();
            }}
            className={style.searchForm}
        >
            <Search
                aria-labelledby="search-header"
                value={inputValue}
                label="Søk på siden"
                variant="primary"
                hideLabel={true}
                onChange={(value) => setInputValue(value)}
                maxLength={100}
                id="search-input"
                autoComplete="off"
            />
        </form>
    );
};
