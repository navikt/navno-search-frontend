import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { SearchHitProps } from '../../../../types/search-result';
import { formatDate } from '../../../../utils/datetime';
import { getTranslations } from '../translations';

const createPublishedAndModifiedString = ({
    modifiedTime,
    publishedTime,
    language,
}: SearchHitProps) => {
    const publishedPart =
        publishedTime &&
        `${getTranslations(language).published} ${formatDate(publishedTime)}`;
    const modifiedPart =
        modifiedTime &&
        `${getTranslations(language).lastModified} ${formatDate(modifiedTime)}`;

    return [publishedPart, modifiedPart].filter(Boolean).join(' | ');
};

type Props = {
    hit: SearchHitProps;
};

export const SearchHitTimestamps = ({ hit }: Props) => {
    const publishedString = createPublishedAndModifiedString(hit);

    return <BodyShort size={'small'}>{publishedString}</BodyShort>;
};
