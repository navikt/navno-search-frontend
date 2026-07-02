import React from 'react';
import { Tag, TagProps } from '@navikt/ds-react';
import { Audience, Language, SearchHitProps } from 'types/search-result';
import { getTranslations } from '../translations';

import style from './SearchHitAudience.module.scss';

type TagConfig = {
    variant: TagProps['variant'];
    color?: TagProps['data-color'];
};

const tagConfig: Record<Audience, TagConfig> = {
    person: { variant: 'info' },
    employer: { variant: 'outline', color: 'meta-purple' },
    provider: { variant: 'outline', color: 'meta-lime' },
    provider_doctor: { variant: 'outline', color: 'meta-lime' },
    provider_municipality_employed: { variant: 'outline', color: 'meta-lime' },
    provider_optician: { variant: 'outline', color: 'meta-lime' },
    provider_administrator: { variant: 'outline', color: 'meta-lime' },
    provider_measures_organizer: { variant: 'outline', color: 'meta-lime' },
    provider_aid_supplier: { variant: 'outline', color: 'meta-lime' },
    provider_other: { variant: 'outline', color: 'meta-lime' },
    other: { variant: 'neutral' },
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
                const config = tagConfig[aud];
                if (!config) {
                    console.error(`Invalid audience: ${aud}`);
                    return null;
                }

                return (
                    <Tag
                        variant={config.variant}
                        data-color={config.color}
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
