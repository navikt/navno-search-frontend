import React from 'react';
import htmlReactParser from 'html-react-parser';
import { SearchHitProps } from 'types/search-result';
import { logResultClick } from 'utils/analytics';
import { BodyLong, LinkPanel } from '@navikt/ds-react';
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
};

export const SearchHit = ({ hit, hitIndex }: Props) => {
    const { displayName, href, highlight, audience } = hit;

    if (!displayName || !href) {
        return null;
    }

    return (
        <LinkPanel
            href={href}
            className={style.searchHit}
            onClick={() => logResultClick(displayName, hitIndex + 1)}
        >
            <LinkPanel.Title>{displayName}</LinkPanel.Title>
            <div className={style.content}>
                {highlight && (
                    <BodyLong className={style.highlight}>
                        {parseHighlight(highlight)}
                    </BodyLong>
                )}
                <div className={style.bottomRow}>
                    {audience && <SearchHitAudience audience={audience} language={hit.language} />}
                    <SearchHitTimestamps hit={hit} />
                </div>
            </div>
        </LinkPanel>
    );
};
