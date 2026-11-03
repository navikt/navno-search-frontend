import { Hono } from 'hono';
import { registry } from './metrics.ts';

// Probes and metrics for NAIS (.nais/config.yml)
export const internal = new Hono()
	.get('/isAlive', (c) => c.json({ message: 'I am alive!' }))
	.get('/isReady', (c) => c.json({ message: 'I am ready!' }))
	.get('/metrics', async (c) => c.body(await registry.metrics(), 200, { 'Content-Type': registry.contentType }));
