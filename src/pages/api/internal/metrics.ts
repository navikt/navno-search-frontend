import { NextApiHandler } from 'next';
import { metricsRegistry } from '../../../utils/metrics';

const metricsHandler: NextApiHandler = async (req, res) => {
    res.setHeader('Content-Type', metricsRegistry.contentType);
    return res.status(200).send(await metricsRegistry.metrics());
};

export default metricsHandler;
