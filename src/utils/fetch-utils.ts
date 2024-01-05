export const fetchWithTimeout = (url: string, timeout: number): Promise<any> =>
    Promise.race([
        fetch(url),
        new Promise((res) =>
            setTimeout(
                () =>
                    res({
                        ok: false,
                        status: 408,
                        statusText: 'Request Timeout',
                    }),
                timeout
            )
        ),
    ]);

const arrayToQueryString = (key: string, array: any[]) =>
    array.reduce(
        (acc, v, i) => `${acc}${i ? `&${key}=` : ''}${encodeURIComponent(v)}`,
        ''
    );

export const objectToQueryString = (params: object) =>
    params
        ? Object.entries(params).reduce((acc, [k, v], i) => {
              if (v === undefined) {
                  return acc;
              }

              const encodedValue =
                  typeof v === 'object'
                      ? // workaround for strange xp search behaviour when sending array as parameter
                        k === 'uf'
                          ? arrayToQueryString(k, v)
                          : encodeURIComponent(JSON.stringify(v))
                      : encodeURIComponent(v);

              return `${acc}${i ? '&' : '?'}${k}=${encodedValue}`;
          }, '')
        : '';
