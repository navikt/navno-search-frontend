import React from 'react';
import { fetchWithTimeout, objectToQueryString } from './_utils';
import { JSDOM } from 'jsdom';
import parse from 'html-react-parser';

const decoratorUrl = process.env.DECORATOR_URL;

export type DecoratorFragments = {
    HEADER: React.ReactNode;
    FOOTER: React.ReactNode;
    SCRIPTS: React.ReactNode;
    STYLES: React.ReactNode;
};

const fetchDecorator = (queryString?: string) => {
    const url = `${decoratorUrl}/${queryString ? queryString : ''}`;
    return fetchWithTimeout(url, 5000)
        .then((res) => {
            if (res.ok) {
                return res.text();
            }
            const error = `Failed to fetch decorator from ${url}: ${res.status} - ${res.statusText}`;
            throw Error(error);
        })
        .catch(console.error);
};

export const getDecorator = async () => {
    const params = {
        chatbot: true,
    };

    const query = objectToQueryString(params);

    const decoratorBody = await fetchDecorator(query);

    if (!decoratorBody) {
        const decoratorUrl = process.env.DECORATOR_URL;
        return {
            HEADER: <div id="decorator-header"></div>,
            STYLES: (
                <link
                    href={`${decoratorUrl}/css/client.css`}
                    rel="stylesheet"
                />
            ),
            FOOTER: <div id="decorator-footer"></div>,
            SCRIPTS: (
                <>
                    <div
                        id="decorator-env"
                        data-src={`${decoratorUrl}/env${query}`}
                    ></div>
                    <script src={`${decoratorUrl}/client.js`}></script>
                </>
            ),
        };
    }

    const { document } = new JSDOM(decoratorBody).window;

    return {
        HEADER: parse(document.getElementById('header-withmenu').innerHTML),
        STYLES: parse(document.getElementById('styles').innerHTML),
        FOOTER: parse(document.getElementById('footer-withmenu').innerHTML),
        SCRIPTS: parse(document.getElementById('scripts').innerHTML),
    };
};
