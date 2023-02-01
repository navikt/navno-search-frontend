import React, { useState } from 'react';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import Cookies from 'js-cookie';
import { Close } from '@navikt/ds-icons';
import { Button, TextField } from '@navikt/ds-react';

import style from './SearchInput.module.scss';

const maxInputLength = 200;

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
            className={style.searchInput}
        >
            <TextField
                aria-labelledby="search-header"
                label={''}
                hideLabel={true}
                className={style.input}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                maxLength={maxInputLength}
                id="search-input"
            />
            <div className={style.buttonsContainer}>
                {inputValue && (
                    <Button
                        variant="tertiary"
                        className={style.button}
                        aria-label={'Nullstill søk'}
                        onClick={() => setInputValue('')}
                    >
                        <Close/>
                    </Button>
                )}
                <Button className={style.button}>
                    {'Søk'}
                </Button>
            </div>
        </form>
    );
};
