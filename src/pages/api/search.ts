import { fetchSearchResults } from '../../fetch/search';
import { NextApiRequest, NextApiResponse } from 'next';
import { SearchParams } from '../../types/search-params';
import { SearchResultProps } from '../../types/search-result';

export type SearchApiResponse = {
    result?: SearchResultProps;
    error?: string;
};

const searchHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SearchApiResponse>
) => {
    const searchParams = req.query as SearchParams;
    await fetchSearchResults(searchParams)
        .then((searchRes) => res.status(200).json({ result: searchRes }))
        .catch((err) => {
            const error = `search error: ${err}`;
            res.status(500).json({ error: error });
        });
};

export default searchHandler;
