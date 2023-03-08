import { NextApiHandler } from 'next';

const isReadyHandler: NextApiHandler = (req, res) => {
    return res.status(200).json({ message: 'I am ready!' });
};

export default isReadyHandler;
