import React, { useState } from 'react';
import { Input } from 'nav-frontend-skjema';
import { BEM } from '../../utils/bem';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { ClearIcon } from './clear-icon/ClearIcon';
import './SearchInput.less';

const maxInputLength = 200;

type Props = {
    initialSearchTerm: string;
    setSearchTerm: (term: string) => void;
    fetchNewResults: () => void;
};

export const SearchInput = ({
    initialSearchTerm,
    setSearchTerm,
    fetchNewResults,
}: Props) => {
    const bem = BEM('search-input');
    const [inputValue, _setInputValue] = useState(
        initialSearchTerm.slice(0, maxInputLength)
    );

    const setInputValue = (value: string) => {
        _setInputValue(value);
        setSearchTerm(value);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                // remove focus to close on-screen keyboards etc
                (document.activeElement as HTMLElement)?.blur?.();
                fetchNewResults();
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
