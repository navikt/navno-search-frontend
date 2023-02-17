import React from 'react';
import htmlReactParser from 'html-react-parser';
import { SearchHitProps } from 'types/search-result';
import { logResultClick } from 'utils/amplitude';
import { BodyLong, LinkPanel } from '@navikt/ds-react';
import { SearchHitOfficeInformation } from './office-information/SearchHitOfficeInformation';
import { SearchHitAudience } from './audience/SearchHitAudience';
import { SearchHitTimestamps } from './timestamps/SearchHitTimestamps';

import style from './SearchHit.module.scss';

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
    const { displayName, href, highlight, officeInformation, audience } = hit;

    if (!displayName || !href) {
        return null;
    }

    return (
        <LinkPanel
            href={href}
            className={style.searchHit}
            onClick={() => logResultClick(href, searchTerm, hitIndex + 1)}
        >
            <LinkPanel.Title>{displayName}</LinkPanel.Title>
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
                    {audience && <SearchHitAudience audience={audience} />}
                    <SearchHitTimestamps hit={hit} />
                </div>
            </div>
        </LinkPanel>
    );
};
