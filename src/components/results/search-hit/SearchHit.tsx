import React from 'react';
import htmlReactParser from 'html-react-parser';
import { formatDate } from 'utils/datetime';
import dayjs from 'dayjs';
import { Audience, SearchHitProps } from 'types/search-result';
import { logResultClick } from 'utils/amplitude';
import { BodyLong, BodyShort, LinkPanel } from '@navikt/ds-react';
import { SearchHitOfficeInformation } from './office-information/SearchHitOfficeInformation';
import { SearchHitAudience } from './audience/SearchHitAudience';

import style from './SearchHit.module.scss';

const createPublishedAndModifiedString = ({
    publish,
    modifiedTime,
    createdTime,
}: SearchHitProps) => {
    const publishedTime = publish?.first || createdTime;
    const publisedString = publishedTime
        ? `Publisert ${formatDate(publishedTime)}`
        : '';
    const modifiedString =
        modifiedTime && dayjs(modifiedTime).unix() > dayjs(publishedTime).unix()
            ? `${publisedString ? ' | ' : ''}Sist endret ${formatDate(
                  modifiedTime
              )}`
            : '';
    return `${publisedString}${modifiedString}`;
};

const parseHighlight = (highlight: string) => {
    return htmlReactParser(
        // trim whitespace
        highlight.replace(/(\r\n|\n|\r)/gm, '')
    );
};

type Props = {
    hit: SearchHitProps;
    hitIndex: number;
    searchTerm: string;
};

export const SearchHit = ({ hit, hitIndex, searchTerm }: Props) => {
    const {
        displayName,
        href,
        highlight,
        priority,
        officeInformation,
        audience = (['person', 'employer', 'provider'] as Audience[])[
            Math.floor(Math.random() * 3)
        ],
    } = hit;

    if (!displayName || !href) {
        return null;
    }

    const publishedString = createPublishedAndModifiedString(hit);

    return (
        <LinkPanel
            href={href}
            onClick={() => logResultClick(href, searchTerm, hitIndex + 1)}
        >
            <LinkPanel.Title className={style.title}>
                {displayName}
            </LinkPanel.Title>
            <div className={style.content}>
                {highlight && (
                    <BodyLong className={style.highlight}>
                        {parseHighlight(highlight)}
                    </BodyLong>
                )}
                {officeInformation && (
                    <SearchHitOfficeInformation {...officeInformation} />
                )}
                <div className={style.bottomRow}>
                    <div className={style.bottomLeft}>
                        {publishedString && (
                            <BodyShort
                                className={style.published}
                                size={'small'}
                            >
                                {publishedString}
                            </BodyShort>
                        )}
                        {priority && (
                            <BodyShort
                                className={style.recommended}
                                size={'small'}
                            >
                                {'Anbefalt innhold'}
                            </BodyShort>
                        )}
                    </div>
                    {audience && <SearchHitAudience audience={audience} />}
                </div>
            </div>
        </LinkPanel>
    );
};
