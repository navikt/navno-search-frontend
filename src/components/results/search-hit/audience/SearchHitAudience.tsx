import React from 'react';
import { Tag, TagProps } from '@navikt/ds-react';
import { Audience, SearchHitProps } from '../../../../types/search-result';

import style from './SearchHitAudience.module.scss';

const textAndVariant: Record<
    Audience,
    { text: string; variant: TagProps['variant'] }
> = {
    person: { text: 'Privatperson', variant: 'info' },
    employer: { text: 'Arbeidsgiver', variant: 'alt1' },
    provider: { text: 'Samarbeidspartner', variant: 'alt2' },
};

type Props = {
    audience: SearchHitProps['audience'];
};

export const SearchHitAudience = ({ audience }: Props) => {
    const audiences = Array.isArray(audience) ? audience : [audience];

    return (
        <>
            {audiences.map((aud) => {
                const tagContent = textAndVariant[aud];
                if (!tagContent) {
                    console.error(`Invalid audience: ${aud}`);
                    return null;
                }

                const { text, variant } = tagContent;

                return (
                    <Tag
                        variant={variant}
                        className={style.tag}
                        size={'small'}
                        key={aud}
                    >
                        {text}
                    </Tag>
                );
            })}
        </>
    );
};
