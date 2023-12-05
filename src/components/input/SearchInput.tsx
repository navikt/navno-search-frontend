import React, { ReactNode, useState } from 'react';
import { useSearchContext } from 'context/ContextProvider';
import { ActionType } from 'context/actions';
import Cookies from 'js-cookie';
import { Close } from '@navikt/ds-icons';
import { Button, Heading, TextField } from '@navikt/ds-react';

import style from './SearchInput.module.scss';

const maxInputLength = 200;

const setSubmitTrackerCookie = () => {
    Cookies.set('nav-search-use', Date.now().toString(), {
        expires: 30,
        domain: '.nav.no',
    });
};

type Props = {
    result: any;
    description: ReactNode;
    initialSearchTerm: string;
    fetchNewResults: () => void;
};

export const SearchInput = ({
    result,
    description,
    initialSearchTerm,
    fetchNewResults,
}: Props) => {
    const [{ params }] = useSearchContext();

    const selectedFacet = result.aggregations.fasetter.buckets.find(
        (f) => f.key === params.f
    );

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
                label={
                    selectedFacet && (
                        <Heading
                            level="2"
                            size="medium"
                            className={style.facet}
                            as="span"
                            aria-label={`Søk i ${selectedFacet.name}`}
                        >
                            {selectedFacet.name}
                        </Heading>
                    )
                }
                description={description}
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
