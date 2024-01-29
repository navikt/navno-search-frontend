import React, { useState } from 'react';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import Cookies from 'js-cookie';
import { Close } from '@navikt/ds-icons';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { SearchResultProps } from 'types/search-result';
import { SearchHeader } from 'components/header/SearchHeader';

import style from './SearchInput.module.scss';

const maxInputLength = 200;

const setSubmitTrackerCookie = () => {
    Cookies.set('nav-search-use', Date.now().toString(), {
        expires: 30,
        domain: '.nav.no',
    });
};

type Props = {
    // result: SearchResultProps; //TODO hvor?
    initialSearchTerm: string;
    fetchNewResults: () => void;
};

export const SearchInput = ({ initialSearchTerm, fetchNewResults }: Props) => {
    const [inputValue, _setInputValue] = useState(
        initialSearchTerm.slice(0, maxInputLength)
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
            onSubmit={(e) => {
                e.preventDefault();
                // remove focus to close on-screen keyboards etc
                (document.activeElement as HTMLElement)?.blur?.();
                fetchNewResults();
                setSubmitTrackerCookie();
            }}
            className={style.searchForm}
        >
            <TextField
                aria-labelledby="search-header"
                label={''}
                hideLabel={true}
                className={style.searchField}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                maxLength={maxInputLength}
                id="search-input"
                autoComplete="off"
            />

            <div className={style.searchButtons}>
                <Button className={style.searchSubmit}>{'Søk'}</Button>
                {inputValue && (
                    <Button
                        icon={<Close aria-hidden />}
                        variant="tertiary"
                        aria-label={'Nullstill søk'}
                        onClick={() => setInputValue('')}
                        className={style.searchReset}
                    />
                )}
            </div>
        </form>
    );
};
