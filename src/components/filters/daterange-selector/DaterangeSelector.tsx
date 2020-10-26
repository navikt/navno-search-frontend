import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import {
    DaterangeBucketProps,
    DaterangeKey,
    DaterangeProps,
} from '../../../types/search-result';
import { daterangeKeyToParam } from '../../../types/search-params';
import { Element } from 'nav-frontend-typografi';
import { logFilterSelection } from '../../../utils/amplitude';
import './DaterangeSelector.less';

type Props = {
    daterangeProps: DaterangeProps;
    setDaterange: (key: number) => void;
};

const bucketsDisplayOrder = [
    DaterangeKey.Last7Days,
    DaterangeKey.Last30Days,
    DaterangeKey.Last12Months,
    DaterangeKey.Over12Months,
];

const sortBuckets = (a: DaterangeBucketProps, b: DaterangeBucketProps) =>
    bucketsDisplayOrder.indexOf(a.key) - bucketsDisplayOrder.indexOf(b.key);

export const DaterangeSelector = ({ daterangeProps, setDaterange }: Props) => {
    const {
        docCount: allDocCount,
        checked: allChecked,
        buckets,
    } = daterangeProps;

    const onChange = (option: DaterangeKey) => {
        logFilterSelection('tidsperiode', option);
        setDaterange(daterangeKeyToParam[option]);
    };

    return (
        <FilterSectionPanel>
            <Element className={'daterange-label'}>{'Tidsperiode'}</Element>
            <FilterOption
                name={'timerange'}
                type={'radio'}
                label={DaterangeKey.All}
                count={allDocCount}
                defaultChecked={allChecked}
                onChange={() => onChange(DaterangeKey.All)}
                id={'select-date-all'}
            />
            {buckets.sort(sortBuckets).map((bucket, index) => (
                <FilterOption
                    name={'timerange'}
                    type={'radio'}
                    label={bucket.key}
                    count={bucket.docCount}
                    defaultChecked={bucket.checked}
                    onChange={() => onChange(bucket.key)}
                    key={bucket.key}
                    id={`select-date-${index}`}
                />
            ))}
            {/*</RadioGruppe>*/}
        </FilterSectionPanel>
    );
};
