import React from 'react';
import { BEM } from '../../../utils/bem';
import { formatDate } from '../../../utils/datetime';
import dayjs from 'dayjs';
import { SearchHitProps } from '../../../types/search-result';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import {
    Normaltekst,
    Undertekst,
    UndertekstBold,
    Undertittel,
} from 'nav-frontend-typografi';
import './SearchHit.less';

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
        priority,
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
        <LenkepanelBase href={href} className={bem()}>
            <Undertittel className={'lenkepanel__heading'}>
                {displayName}
            </Undertittel>
            <div className={bem('content')}>
                <Undertekst className={bem('display-path')}>
                    {displayPath}
                </Undertekst>
                {highlight && (
                    <Normaltekst className={bem('highlight')}>
                        {highlight}
                    </Normaltekst>
                )}
                <div className={bem('bottom-row')}>
                    {publishedString && (
                        <Undertekst className={bem('published')}>
                            {publishedString}
                        </Undertekst>
                    )}
                    {priority && (
                        <UndertekstBold>{'Anbefalt innhold'}</UndertekstBold>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};
