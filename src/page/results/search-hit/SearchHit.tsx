import React from 'react';
import { BEM } from '../../../utils/bem';
import { formatDate } from '../../../utils/datetime';
import dayjs from 'dayjs';
import './SearchHit.less';
import { SearchHitProps } from '../../../types/search-result';
import LenkepanelNavNo from '../../../components/lenkepanel/LenkepanelNavNo';

const createPublishedAndModifiedString = (
    publish: SearchHitProps['publish'],
    modifiedTime: SearchHitProps['modifiedTime']
) => {
    const publishedTime = publish.from || publish.first;
    const publisedString = publishedTime
        ? `Publisert ${formatDate(publishedTime)}`
        : '';
    const modifiedString =
        modifiedTime && dayjs(modifiedTime).unix() > dayjs(publishedTime).unix()
            ? `${publisedString ? ' - ' : ''}Sist endret ${formatDate(
                  modifiedTime
              )}`
            : '';
    return `${publisedString}${modifiedString}`;
};

export const SearchHit = (props: SearchHitProps) => {
    const {
        displayName,
        href,
        displayPath,
        highlight,
        publish,
        modifiedTime,
    } = props;

    if (!displayName || !href) {
        return null;
    }

    const bem = BEM('search-hit');

    const publishedString = createPublishedAndModifiedString(
        publish,
        modifiedTime
    );

    return (
        <LenkepanelNavNo href={href} tittel={displayName} className={bem()}>
            <p className={bem('display-path')}>{displayPath}</p>
            {highlight && <p className={bem('highlight')}>{highlight}</p>}
            {publishedString && (
                <p className={bem('published')}>{publishedString}</p>
            )}
        </LenkepanelNavNo>
    );
};
