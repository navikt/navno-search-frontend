import { NextApiHandler } from 'next';

const isAliveHandler: NextApiHandler = (req, res) => {
    return res.status(200).json({ message: 'I am alive!' });
};

export default isAliveHandler;
