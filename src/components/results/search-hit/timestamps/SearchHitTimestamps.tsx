import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { SearchHitProps } from '../../../../types/search-result';
import { formatDate } from '../../../../utils/datetime';
import { getTranslations } from '../translations';

const createPublishedAndModifiedString = ({
    modifiedTime,
    language,
}: SearchHitProps) => {
    return modifiedTime
        ? `${getTranslations(language).lastModified} ${formatDate(
              modifiedTime
          )}`
        : '';
};

type Props = {
    hit: SearchHitProps;
};

export const SearchHitTimestamps = ({ hit }: Props) => {
    const publishedString = createPublishedAndModifiedString(hit);

    return <BodyShort size={'small'}>{publishedString}</BodyShort>;
};
