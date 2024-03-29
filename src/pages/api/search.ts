import { fetchSearchResults } from '../../utils/fetch-search-result';
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
    const searchParams = req.query as unknown as SearchParams;

    await fetchSearchResults(searchParams)
        .then((searchRes) => {
            res.status(200).json({ result: searchRes });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: err });
        });
};

export default searchHandler;
