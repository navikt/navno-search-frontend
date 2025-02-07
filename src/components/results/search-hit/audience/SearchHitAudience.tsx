import React from 'react';
import { Tag, TagProps } from '@navikt/ds-react';
import { Audience, Language, SearchHitProps } from 'types/search-result';
import { getTranslations } from '../translations';

import style from './SearchHitAudience.module.scss';

const variant: Record<Audience, TagProps['variant']> = {
    person: 'info',
    employer: 'alt1',
    provider: 'alt2',
    provider_doctor: 'alt2',
    provider_municipality_employed: 'alt2',
    provider_optician: 'alt2',
    provider_administrator: 'alt2',
    provider_measures_organizer: 'alt2',
    provider_aid_supplier: 'alt2',
    provider_other: 'alt2',
    other: 'neutral',
};

type Props = {
    audience: Required<SearchHitProps>['audience'];
    language: Language;
};

export const SearchHitAudience = ({ audience, language }: Props) => {
    const audiences = Array.isArray(audience) ? audience : [audience];

    return (
        <>
            {audiences.map((aud) => {
                if (!variant[aud]) {
                    console.error(`Invalid audience: ${aud}`);
                    return null;
                }

                return (
                    <Tag
                        variant={variant[aud]}
                        className={style.tag}
                        size={'small'}
                        key={aud}
                    >
                        {getTranslations(language)[aud]}
                    </Tag>
                );
            })}
        </>
    );
};
