import { logger } from '@navikt/next-logger';
import { fetchSearchResults } from '../../utils/fetch-search-result';
import { NextApiRequest, NextApiResponse } from 'next';
import { SearchParams } from '../../types/search-params';
import { SearchResultProps } from '../../types/search-result';
import { metrics } from '../../utils/metrics';

export type SearchApiResponse = {
    result?: SearchResultProps;
    error?: string;
};

const searchHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SearchApiResponse>
) => {
    const searchParams = req.query as unknown as SearchParams;

    const stopTimer = metrics.searchUpstreamDuration.startTimer();

    await fetchSearchResults(searchParams)
        .then((searchRes) => {
            stopTimer({ status: 'success' });
            metrics.searchRequests.inc({ status: 'success' });
            res.status(200).json({ result: searchRes });
        })
        .catch((err) => {
            stopTimer({ status: 'error' });
            metrics.searchRequests.inc({ status: 'error' });
            logger.error(err, 'Failed to fetch search results in /api/search');
            res.status(500).send({ error: 'Failed to fetch search results' });
        });
};

export default searchHandler;
