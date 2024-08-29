const originalFetch = window.fetch;

export const endFetchMock = () => {
    window.fetch = originalFetch;
};

export const startFetchMock = () => {
    const mockResponse = (
        body: any,
        status: number = 200,
        ok: boolean = true
    ): Response => {
        return {
            ok,
            status,
            statusText: status === 200 ? 'OK' : 'Error',
            headers: new Headers(),
            url: '',
            type: 'basic',
            redirected: false,
            body: null,
            bodyUsed: false,
            clone: () => mockResponse(body, status, ok),
            async json() {
                return body;
            },
            async text() {
                return JSON.stringify(body);
            },
            async formData() {
                return new FormData();
            },
            async blob() {
                return new Blob();
            },
            async arrayBuffer() {
                return new ArrayBuffer(0);
            },
        } as Response;
    };

    window.fetch = async (
        url: RequestInfo | URL,
        options?: RequestInit
    ): Promise<Response> => {
        // Check the URL or options to return different mock responses
        if (typeof url === 'string' && url.includes('/fetch-mock')) {
            return Promise.resolve(mockResponse({ data: 'Foo bar' }));
        }

        // Default mock response
        return Promise.resolve(
            mockResponse({ error: 'Not found' }, 404, false)
        );
    };
};
