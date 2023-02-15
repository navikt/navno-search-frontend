import React from 'react';
import htmlReactParser from 'html-react-parser';
import { formatDate } from 'utils/datetime';
import dayjs from 'dayjs';
import { SearchHitProps } from 'types/search-result';
import { logResultClick } from 'utils/amplitude';

import style from './SearchHit.module.scss';
import { BodyLong, BodyShort, LinkPanel } from '@navikt/ds-react';

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

const officeInformationTable = (info: SearchHitProps['officeInformation']) => {
    const { phone, audienceReception } = info;

    return (
        <>
            {phone && (
                <div>
                    <span className={style.label}>{'Telefon:'}</span>
                    {phone}
                </div>
            )}
            {audienceReception && (
                <div>
                    <span className={style.label}>{'Publikumsmottak:'}</span>
                    {audienceReception}
                </div>
            )}
        </>
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
        audience
    } = hit;

    if (!displayName || !href) {
        return null;
    }

    const publishedString = createPublishedAndModifiedString(hit);

    return (
        <LinkPanel
            href={href}
            className={style.searchHit}
            onClick={() => logResultClick(href, searchTerm, hitIndex + 1)}
        >
            <LinkPanel.Title>
                {displayName}
            </LinkPanel.Title>
            <div className={style.content}>
                {highlight && (
                    <BodyLong className={style.highlight}>
                        {parseHighlight(highlight)}
                    </BodyLong>
                )}
                {officeInformation && (
                    <div className={style.officeInfo}>
                        {officeInformationTable(officeInformation)}
                    </div>
                )}
                <div className={style.bottomRow}>
                    {publishedString && (
                        <BodyShort className={style.published}>
                            {publishedString}
                        </BodyShort>
                    )}
                    {priority && (
                        <BodyShort className={style.recommended}>
                            {'Anbefalt innhold'}
                        </BodyShort>
                    )}
                </div>
            </div>
        </LinkPanel>
    );
};
