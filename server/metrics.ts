import { Counter, Histogram, Registry } from '@prometheus-io/client';

// Our own registry, because Vite's dev server re-runs this module: registering
// the same metrics again in the client's default registry throws
export const registry = new Registry();

export const searches = new Counter({
	name: 'navno_search_requests_total',
	help: 'Searches the /sok page made to the upstream search service, by outcome. A failed search is followed by one for the unfiltered listing',
	labelNames: ['status'] as const,
	registers: [registry],
});

export const upstreamDuration = new Histogram({
	name: 'navno_search_upstream_duration_seconds',
	help: 'Duration of calls to the upstream search service, one per page of hits, by outcome',
	labelNames: ['status'] as const,
	buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
	registers: [registry],
});

// Every series exists from startup, so rates and alerts work before the first search
for (const status of ['success', 'error']) {
	searches.inc({ status }, 0);
	upstreamDuration.zero({ status });
}
