import { JSDOM } from 'jsdom';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Renders the way the server does, into a document to query
export const render = (element: ReactElement) => new JSDOM(renderToStaticMarkup(element)).window.document;

export const text = (node: Node | null | undefined) => (node?.textContent ?? '').replace(/\s+/g, ' ').trim();
