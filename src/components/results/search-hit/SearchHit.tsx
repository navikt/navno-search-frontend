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
                    <span className={'label'}>{'Telefon:'}</span>
                    {phone}
                </div>
            )}
            {audienceReception && (
                <div>
                    <span className={'label'}>{'Publikumsmottak:'}</span>
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
    } = hit;

    if (!displayName || !href) {
        return null;
    }

    const bem = BEM('search-hit');

    const publishedString = createPublishedAndModifiedString(hit);

    return (
        <LenkepanelBase
            href={href}
            className={bem()}
            onClick={() => logResultClick(href, searchTerm, hitIndex + 1)}
        >
            <Undertittel className={`${bem('header')} lenkepanel__heading`}>
                {displayName}
            </Undertittel>
            <div className={bem('content')}>
                {highlight && (
                    <Normaltekst className={bem('highlight')}>
                        {parseHighlight(highlight)}
                    </Normaltekst>
                )}
                {officeInformation && (
                    <div className={bem('office-info')}>
                        {officeInformationTable(officeInformation)}
                    </div>
                )}
                <div className={bem('bottom-row')}>
                    {publishedString && (
                        <Undertekst className={bem('published')}>
                            {publishedString}
                        </Undertekst>
                    )}
                    {priority && (
                        <UndertekstBold className={bem('recommended')}>
                            {'Anbefalt innhold'}
                        </UndertekstBold>
                    )}
                </div>
            </div>
        </LenkepanelBase>
    );
};
