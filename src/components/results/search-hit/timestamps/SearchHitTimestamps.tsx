import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { SearchHitProps } from '../../../../types/search-result';
import { formatDate } from '../../../../utils/datetime';
import dayjs from 'dayjs';
import { getTranslations } from '../translations';

const createPublishedAndModifiedString = ({
    publish,
    modifiedTime,
    createdTime,
    language,
}: SearchHitProps) => {
    const publishedTime = publish?.first || createdTime;

    const publishedString = `${
        getTranslations(language).published
    } ${formatDate(publishedTime)}`;

    const isModifiedSincePublishedTime =
        modifiedTime &&
        dayjs(modifiedTime).unix() > dayjs(publishedTime).unix();

    if (!isModifiedSincePublishedTime) {
        return publishedString;
    }

    return `${publishedString} | ${
        getTranslations(language).lastModified
    } ${formatDate(modifiedTime)}`;
};

type Props = {
    hit: SearchHitProps;
};

export const SearchHitTimestamps = ({ hit }: Props) => {
    const publishedString = createPublishedAndModifiedString(hit);

    return <BodyShort size={'small'}>{publishedString}</BodyShort>;
};
