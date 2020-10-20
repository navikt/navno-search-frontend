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
import htmlReactParser from 'html-react-parser';
import { logResultClick } from '../../../utils/amplitude';
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
                <span>
                    <span className={'label'}>{'Telefon:'}</span>
                    {phone}
                </span>
            )}
            {audienceReception && (
                <span>
                    <span className={'label'}>{'Publikumsmottak:'}</span>
                    {audienceReception}
                </span>
            )}
        </>
    );
};

type Props = {
    hit: SearchHitProps;
    searchTerm: string;
};

export const SearchHit = ({ hit, searchTerm }: Props) => {
    const {
        displayName,
        href,
        displayPath,
        highlight,
        publish,
        modifiedTime,
        priority,
        officeInformation,
    } = hit;

    if (!displayName || !href) {
        return null;
    }

    const bem = BEM('search-hit');

    const publishedString = createPublishedAndModifiedString(
        publish,
        modifiedTime
    );

    return (
        <LenkepanelBase
            href={href}
            className={bem()}
            onClick={() => logResultClick(href, searchTerm)}
        >
            <Undertittel className={`${bem('header')} lenkepanel__heading`}>
                {displayName}
            </Undertittel>
            <div className={bem('content')}>
                <Undertekst className={bem('display-path')}>
                    {displayPath}
                </Undertekst>
                {highlight && (
                    <Normaltekst className={bem('highlight')}>
                        {parseHighlight(highlight)}
                    </Normaltekst>
                )}
                {officeInformation && (
                    <Normaltekst className={bem('office-info')}>
                        {officeInformationTable(officeInformation)}
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
