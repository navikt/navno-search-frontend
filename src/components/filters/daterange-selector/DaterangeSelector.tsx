import React from 'react';
import { FilterSectionPanel } from '../filter-section-panel/FilterSectionPanel';
import { FilterOption } from '../filter-section-panel/FilterOption';
import {
    DaterangeBucketProps,
    DaterangeKey,
    DaterangeProps,
} from 'types/search-result';
import { logFilterSelection } from 'utils/amplitude';
import { Heading } from '@navikt/ds-react';
import { useSearchContext } from '../../../context/ContextProvider';
import { ActionType } from '../../../context/actions';
import { daterangeKeyToParam } from '../../../types/search-params';

type Props = {
    daterangeProps: DaterangeProps;
};

const radioGroupName = 'timerange';

const bucketsDisplayOrder = [
    DaterangeKey.Last7Days,
    DaterangeKey.Last30Days,
    DaterangeKey.Last12Months,
    DaterangeKey.Over12Months,
];

const sortBuckets = (a: DaterangeBucketProps, b: DaterangeBucketProps) =>
    bucketsDisplayOrder.indexOf(a.key) - bucketsDisplayOrder.indexOf(b.key);

export const DaterangeSelector = ({ daterangeProps }: Props) => {
    const { docCount: allDocCount, buckets } = daterangeProps;

    const [{ params }, dispatch] = useSearchContext();

    const onChange = (option: DaterangeKey) => {
        logFilterSelection('tidsperiode', option);
        dispatch({
            type: ActionType.SetDaterange,
            daterangeKey: option,
        });
    };

    return (
        <FilterSectionPanel>
            <Heading level="3" size="small">
                {'Tidsperiode'}
            </Heading>
            <FilterOption
                name={radioGroupName}
                type={'radio'}
                label={DaterangeKey.All}
                count={allDocCount}
                checked={
                    daterangeKeyToParam[DaterangeKey.All] === params.daterange
                }
                onChange={() => onChange(DaterangeKey.All)}
                id={'select-date-all'}
            />
            {buckets.sort(sortBuckets).map((bucket, index) => (
                <FilterOption
                    name={radioGroupName}
                    type={'radio'}
                    label={bucket.key}
                    count={bucket.docCount}
                    checked={
                        daterangeKeyToParam[bucket.key] === params.daterange
                    }
                    onChange={() => onChange(bucket.key)}
                    key={bucket.key}
                    id={`select-date-${index}`}
                />
            ))}
        </FilterSectionPanel>
    );
};
