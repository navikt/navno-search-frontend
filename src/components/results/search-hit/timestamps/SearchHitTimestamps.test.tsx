import React from 'react';
import { render } from '@testing-library/react';
import { SearchHitTimestamps } from './SearchHitTimestamps';
import { SearchHitProps } from 'types/search-result';

describe('SearchHitTimestamps', () => {
    const hit: SearchHitProps = {
        displayName: 'Barnehage',
        href: 'https:///www.nav.no',
        highlight: '<b>Barnehagen</b> er en sosial arena og hjelpemidler.',
        modifiedTime: '2022-01-01T00:00:00Z',
        publishedTime: '2021-12-31T00:00:00Z',
        audience: ['person'],
        language: 'no',
    };

    test('renders published and modified date correctly in norwegian', () => {
        const { getByText } = render(<SearchHitTimestamps hit={hit} />);
        const timestamp = getByText(
            'Publisert 31.12.2021 | Oppdatert 01.01.2022'
        );
        expect(timestamp).toBeInTheDocument();
    });

    test('renders published and modified date correctly in english', () => {
        const modifiedHit = { ...hit, language: 'en' } as SearchHitProps;

        const { getByText } = render(<SearchHitTimestamps hit={modifiedHit} />);
        const timestamp = getByText(
            'Published 31.12.2021 | Updated 01.01.2022'
        );
        expect(timestamp).toBeInTheDocument();
    });

    test('renders published and modified date correctly in english', () => {
        const modifiedHit = { ...hit, language: 'en' } as SearchHitProps;

        const { getByText } = render(<SearchHitTimestamps hit={modifiedHit} />);
        const timestamp = getByText(
            'Published 31.12.2021 | Updated 01.01.2022'
        );
        expect(timestamp).toBeInTheDocument();
    });

    test('renders published only date correctly', () => {
        const modifiedHit = {
            ...hit,
            modifiedTime: undefined,
        } as SearchHitProps;

        const { getByText } = render(<SearchHitTimestamps hit={modifiedHit} />);
        const timestamp = getByText('Publisert 31.12.2021');
        expect(timestamp).toBeInTheDocument();
    });
});
