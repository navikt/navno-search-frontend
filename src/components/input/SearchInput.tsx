import React, { useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import { BEM } from '../../utils/bem';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { ClearIcon } from './clear-icon/ClearIcon';
import { useSearchContext } from '../../context/ContextProvider';
import { ActionType } from '../../context/actions';
import Cookies from 'js-cookie';
import './SearchInput.less';

const maxInputLength = 200;

const setSubmitTrackerCookie = () => {
    Cookies.set('nav-search-use', Date.now().toString(), { expires: 30, domain: '.nav.no' });
};

type Props = {
    initialSearchTerm: string;
    fetchNewResults: () => void;
};

export const SearchInput = ({ initialSearchTerm, fetchNewResults }: Props) => {
    const bem = BEM('search-input');
    const [inputValue, _setInputValue] = useState(
        initialSearchTerm.slice(0, maxInputLength),
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
            className={bem()}
        >
            <Input
                aria-labelledby={'search-header'}
                className={bem('input')}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                maxLength={maxInputLength}
                placeholder={'Søk på nav.no'}
                id={'search-input'}
            />
            <div className={bem('buttons-container')}>
                {inputValue && (
                    <Flatknapp
                        className={bem('button')}
                        mini={true}
                        aria-label={'Nullstill søk'}
                        onClick={() => setInputValue('')}
                        htmlType={'button'}
                    >
                        <ClearIcon />
                    </Flatknapp>
                )}
                <Hovedknapp className={bem('button')} htmlType={'submit'}>
                    {'Søk'}
                </Hovedknapp>
            </div>
        </form>
    );
};
