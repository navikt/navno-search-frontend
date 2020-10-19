import { SearchHitProps } from '../types/search-result';
import dayjs from 'dayjs';

export const sortHitsByDate = (a: SearchHitProps, b: SearchHitProps) => {
    const lastChanged = (props: SearchHitProps) =>
        Math.max(
            ...[
                props.publish.first || 0,
                props.publish.from || 0,
                props.modifiedTime || 0,
            ].map((v) => dayjs(v).unix())
        );

    return lastChanged(b) - lastChanged(a);
};
