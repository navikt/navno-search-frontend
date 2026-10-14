import { Counter, Histogram, register } from '@prometheus-io/client';

// Kept on globalThis so that Next's module duplication (per-route bundles, dev
// reloads) doesn't try to register the same metric twice.
type Metrics = {
    searchRequests: Counter<'status'>;
    searchUpstreamDuration: Histogram<'status'>;
};

const globalForMetrics = globalThis as typeof globalThis & {
    __searchMetrics?: Metrics;
};

export const metrics: Metrics = (globalForMetrics.__searchMetrics ??= {
    searchRequests: new Counter({
        name: 'navno_search_requests_total',
        help: 'Search requests handled by /api/search, by outcome',
        labelNames: ['status'],
    }),
    searchUpstreamDuration: new Histogram({
        name: 'navno_search_upstream_duration_seconds',
        help: 'Duration of calls to the upstream search service, by outcome',
        labelNames: ['status'],
        buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),
});

export const metricsRegistry = register;
