import React from 'react';
import { SearchHitProps } from '../../../../types/search-result';

import style from './SearchHitOfficeInformation.module.scss';

type Props = Required<SearchHitProps>['officeInformation'];

export const SearchHitOfficeInformation = ({
    audienceReception,
    phone,
}: Props) => {
    return (
        <div className={style.officeInfo}>
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
        </div>
    );
};
