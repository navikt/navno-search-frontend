import { logger } from '@navikt/next-logger';
import { NextApiRequest, NextApiResponse } from 'next';
import { Config } from 'config';
import { fetchWithTimeout } from 'utils/fetch-utils';

type SearchUrlResponse = {
    url: string | null;
    title: string | null;
};

const searchUrlHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SearchUrlResponse | { error: string }>
) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { term } = req.query;
    if (typeof term !== 'string' || !term.trim()) {
        logger.warn('Invalid search-url term');
        res.status(400).json({ error: 'A single non-empty term is required' });
        return;
    }

    try {
        const url = new URL('search-url', Config.URLS.searchService);
        url.search = new URLSearchParams({ term }).toString();

        logger.info(
            `Fetching search URL for term: ${term} from ${url.toString()}`
        );

        const response = await fetchWithTimeout(url.toString(), 5000);
        if (!response.ok) {
            logger.error(
                { status: response.status },
                'Failed to fetch search URL in /api/search-url'
            );
            res.status(response.status).json({
                error: 'Failed to fetch search URL',
            });
            return;
        }

        const result: SearchUrlResponse = await response.json();
        res.status(200).json(result);
    } catch (err) {
        logger.error(err, 'Failed to fetch search URL in /api/search-url');
        res.status(500).json({ error: 'Failed to fetch search URL' });
    }
};

export default searchUrlHandler;
