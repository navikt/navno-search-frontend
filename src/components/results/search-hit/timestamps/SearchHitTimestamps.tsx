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
    if (!publishedTime) {
        return null;
    }

    const translations = getTranslations(language);

    const publishedString = `${translations.published} ${formatDate(publishedTime)}`;

    if (!modifiedTime || publishedTime >= modifiedTime) {
        return publishedString;
    }

    const modifiedString = `${translations.lastModified} ${formatDate(modifiedTime)}`;

    return `${publishedString} | ${modifiedString}`;
};

export type SearchHitTimestampsProps = {
    hit: SearchHitProps;
};

export const SearchHitTimestamps = ({ hit }: SearchHitTimestampsProps) => {
    const publishedString = createPublishedAndModifiedString(hit);

    if (!publishedString) {
        return null;
    }

    return <BodyShort size={'small'}>{publishedString}</BodyShort>;
};
