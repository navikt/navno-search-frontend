import { logger } from '@navikt/next-logger';

export const fetchWithTimeout = (
    url: string,
    timeout: number
): Promise<Response> => {
    let hasTimedOut = false;

    // If the request already timed out, the real fetch's outcome no longer
    // affects the response we return, but we still want to know it happened
    // so slow/failing upstream requests can be investigated.
    const trackedFetch = fetch(url).catch((err) => {
        if (hasTimedOut) {
            logger.error(
                err,
                `Fetch to "${url}" failed after the request had already timed out`
            );
        }
        throw err;
    });

    return Promise.race([
        trackedFetch,
        new Promise<Response>((res) =>
            setTimeout(() => {
                hasTimedOut = true;
                res({
                    ok: false,
                    status: 408,
                    statusText: 'Request Timeout',
                } as Response);
            }, timeout)
        ),
    ]);
};

export const objectToQueryString = (params: object) =>
    params
        ? Object.entries(params).reduce((acc, [k, v], i) => {
              if (v === undefined) {
                  return acc;
              }

              return `${acc}${i ? '&' : '?'}${k}=${v}`;
          }, '')
        : '';
