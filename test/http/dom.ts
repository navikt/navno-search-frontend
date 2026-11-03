/*
 * DOM queries that don't depend on how the page is built: text, legends,
 * labels and input types and values, never class names or framework markup.
 */

const normalize = (s: string | null | undefined) =>
    (s ?? '').replace(/\s+/g, ' ').trim();

export const text = (el: Node | null | undefined) => normalize(el?.textContent);

export const main = (doc: Document) => {
    const el = doc.querySelector('#maincontent');
    if (!el) {
        throw new Error('No #maincontent');
    }
    return el;
};

// The innermost elements whose whole text matches
export const byText = (root: ParentNode, wanted: string | RegExp) => {
    const matches = (el: Element) =>
        typeof wanted === 'string'
            ? text(el) === wanted
            : wanted.test(text(el));
    return [...root.querySelectorAll('*')].filter(
        (el) => matches(el) && ![...el.children].some(matches)
    );
};

export const summary = (doc: Document) =>
    byText(main(doc), /^\d+ treff\b.* med valgte søkefilter\.$/).map(text);

export const showMore = (doc: Document) =>
    byText(main(doc), 'Vis flere treff').map((el) => el.closest('a, button'));

// Links to the given hits, in page order
export const hitLinks = (doc: Document, hits: { href: string }[]) => {
    const hrefs = new Set(hits.map((hit) => hit.href));
    return [...main(doc).querySelectorAll('a[href]')].filter((a) =>
        hrefs.has(a.getAttribute('href') ?? '')
    );
};

// The largest element around a hit link that holds no other link
export const hitCard = (link: Element) => {
    let card = link;
    while (
        card.parentElement &&
        card.parentElement.querySelectorAll('a[href]').length === 1
    ) {
        card = card.parentElement;
    }
    return card;
};

export const fieldset = (doc: Document, legend: string) => {
    const el = [...doc.querySelectorAll('fieldset')].find(
        (fs) => text(fs.querySelector(':scope > legend')) === legend
    );
    if (!el) {
        throw new Error(`No fieldset with the legend "${legend}"`);
    }
    return el;
};

const inputs = (root: ParentNode, type: 'radio' | 'checkbox') => [
    ...root.querySelectorAll<HTMLInputElement>(`input[type="${type}"]`),
];

// The number shown after an input (a facet or underfacet count): the first
// number in the text between it and the next input
const countAfter = (input: Element) => {
    const doc = input.ownerDocument;
    const { NodeFilter } = doc.defaultView as Window & typeof globalThis;
    const walker = doc.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );
    walker.currentNode = input;
    let between = '';
    for (
        let node = walker.nextNode();
        node && node.nodeName !== 'INPUT';
        node = walker.nextNode()
    ) {
        if (node.nodeType === node.TEXT_NODE) {
            between += ` ${node.textContent}`;
        }
    }
    const count = between.match(/\d+/)?.[0];
    return count === undefined ? undefined : Number(count);
};

// [value, label, checked] for each input of a type
export const options = (root: ParentNode, type: 'radio' | 'checkbox') =>
    inputs(root, type).map((input) => [
        input.value,
        text(input.labels?.[0]),
        input.checked,
    ]);

// [value, label, count] for each input of a type
export const counts = (root: ParentNode, type: 'radio' | 'checkbox') =>
    inputs(root, type).map((input) => [
        input.value,
        text(input.labels?.[0]),
        countAfter(input),
    ]);

export const checked = (root: ParentNode, type: 'radio' | 'checkbox') =>
    inputs(root, type)
        .filter((input) => input.checked)
        .map((input) => input.value);

// Whether the nodes come in this order in the document
export const inOrder = (...nodes: Node[]) =>
    nodes.every(
        (node, i) =>
            i === 0 ||
            !!(
                nodes[i - 1].compareDocumentPosition(node) &
                node.DOCUMENT_POSITION_FOLLOWING
            )
    );
