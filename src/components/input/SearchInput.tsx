import React from 'react';
import { Input } from 'nav-frontend-skjema';
import { BEM } from '../../utils/bem';
import { Hovedknapp } from 'nav-frontend-knapper';
import './SearchInput.less';

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
                onChange={(e) => setSearchTerm(e.target.value)}
                defaultValue={initialSearchTerm}
                placeholder={'Søk på nav.no'}
            />
            <Hovedknapp className={bem('button')} htmlType={'submit'}>
                {'Søk'}
            </Hovedknapp>
        </form>
    );
};
