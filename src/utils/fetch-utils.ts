export const fetchWithTimeout = (
    url: string,
    timeout: number
): Promise<Response> =>
    Promise.race([
        fetch(url),
        new Promise<Response>((res) =>
            setTimeout(
                () =>
                    res({
                        ok: false,
                        status: 408,
                        statusText: 'Request Timeout',
                    } as Response),
                timeout
            )
        ),
    ]);

export const objectToQueryString = (params: object) =>
    params
        ? Object.entries(params).reduce((acc, [k, v], i) => {
              if (v === undefined) {
                  return acc;
              }

              return `${acc}${i ? '&' : '?'}${k}=${v}`;
          }, '')
        : '';
