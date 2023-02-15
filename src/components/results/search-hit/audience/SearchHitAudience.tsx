import React from 'react';
import { Tag, TagProps } from '@navikt/ds-react';
import { Audience } from '../../../../types/search-result';

import style from './SearchHitAudience.module.scss';

const textAndVariant: Record<
    Audience,
    { text: string; variant: TagProps['variant'] }
> = {
    person: { text: 'Privatperson', variant: 'alt1-filled' },
    employer: { text: 'Arbeidsgiver', variant: 'alt3-filled' },
    provider: { text: 'Samarbeidspartner', variant: 'alt2-filled' },
};

type Props = {
    audience: Audience;
};

export const SearchHitAudience = ({ audience }: Props) => {
    const { text, variant } = textAndVariant[audience];

    return (
        <Tag variant={variant} className={style.tag}>
            {text}
        </Tag>
    );
};
