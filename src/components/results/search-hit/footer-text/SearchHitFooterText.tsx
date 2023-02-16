import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { SearchHitProps } from '../../../../types/search-result';
import { formatDate } from '../../../../utils/datetime';
import dayjs from 'dayjs';

import style from './SearchHitFooterText.module.scss';

const createPublishedAndModifiedString = ({
    publish,
    modifiedTime,
    createdTime,
}: SearchHitProps) => {
    const publishedTime = publish?.first || createdTime;

    const publishedString = `Publisert ${formatDate(publishedTime)}`;

    const isModifiedSincePublishedTime =
        modifiedTime &&
        dayjs(modifiedTime).unix() > dayjs(publishedTime).unix();

    if (!isModifiedSincePublishedTime) {
        return publishedString;
    }

    return `${publishedString} | Sist endret ${formatDate(modifiedTime)}`;
};

type Props = {
    hit: SearchHitProps;
};

export const SearchHitFooterText = ({ hit }: Props) => {
    const { priority } = hit;
    const publishedString = createPublishedAndModifiedString(hit);

    return (
        <>
            <BodyShort size={'small'}>{publishedString}</BodyShort>
            {priority && (
                <BodyShort className={style.recommended} size={'small'}>
                    {'Anbefalt innhold'}
                </BodyShort>
            )}
        </>
    );
};
