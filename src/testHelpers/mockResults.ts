import { DaterangeKey, SearchResultProps } from 'types/search-result';

export const mockResults = () => {
    const result: SearchResultProps = {
        c: 1,
        s: 0,
        daterange: -1,
        isMore: true,
        word: 'stønad',
        total: 336,
        fasett: 'Innhold',
        fasettKey: '0',
        aggregations: {
            fasetter: {
                buckets: [
                    {
                        key: '0',
                        name: 'Innhold',
                        docCount: 336,
                        underaggregeringer: {
                            buckets: [
                                {
                                    key: '0',
                                    name: 'Informasjon',
                                    docCount: 261,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '1',
                                    name: 'Kontor',
                                    docCount: 9,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '2',
                                    name: 'Søknad og skjema',
                                    docCount: 66,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                            ],
                        },
                        checked: true,
                        default: true,
                    },
                    {
                        key: 'en',
                        name: 'English',
                        docCount: 24,
                        underaggregeringer: {
                            buckets: [],
                        },
                        checked: false,
                        default: false,
                    },
                    {
                        key: '1',
                        name: 'Nyheter',
                        docCount: 49,
                        underaggregeringer: {
                            buckets: [
                                {
                                    key: '1',
                                    name: 'Privatperson',
                                    docCount: 4,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '4',
                                    name: 'Statistikk',
                                    docCount: 8,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '0',
                                    name: 'Presse',
                                    docCount: 18,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: 'pm',
                                    name: 'Pressemeldinger',
                                    docCount: 7,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '5',
                                    name: 'NAV og samfunn',
                                    docCount: 34,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                            ],
                        },
                        checked: false,
                        default: false,
                    },
                    {
                        key: '5',
                        name: 'Analyser og forskning',
                        docCount: 129,
                        underaggregeringer: {
                            buckets: [],
                        },
                        checked: false,
                        default: false,
                    },
                    {
                        key: '3',
                        name: 'Statistikk',
                        docCount: 1420,
                        underaggregeringer: {
                            buckets: [],
                        },
                        checked: false,
                        default: false,
                    },
                    {
                        key: '4',
                        name: 'Innhold fra fylker',
                        docCount: 195,
                        underaggregeringer: {
                            buckets: [
                                {
                                    key: '0',
                                    name: 'Agder',
                                    docCount: 6,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '1',
                                    name: 'Innlandet',
                                    docCount: 3,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '2',
                                    name: 'Møre og Romsdal',
                                    docCount: 2,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '3',
                                    name: 'Nordland',
                                    docCount: 25,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '4',
                                    name: 'Oslo',
                                    docCount: 36,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '5',
                                    name: 'Rogaland',
                                    docCount: 11,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '6',
                                    name: 'Troms og Finnmark',
                                    docCount: 19,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '7',
                                    name: 'Trøndelag',
                                    docCount: 18,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '8',
                                    name: 'Vestfold og Telemark',
                                    docCount: 25,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '9',
                                    name: 'Vestland',
                                    docCount: 17,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '10',
                                    name: 'Vest-Viken',
                                    docCount: 19,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                                {
                                    key: '11',
                                    name: 'Øst-Viken',
                                    docCount: 14,
                                    underaggregeringer: {
                                        buckets: [],
                                    },
                                    checked: false,
                                },
                            ],
                        },
                        checked: false,
                        default: false,
                    },
                    {
                        key: '2',
                        name: 'Filer',
                        docCount: 3028,
                        underaggregeringer: {
                            buckets: [],
                        },
                        checked: false,
                        default: false,
                    },
                ],
            },
            Tidsperiode: {
                buckets: [
                    {
                        key: DaterangeKey.Last7Days,
                        docCount: 20,
                        from: '2023-12-28T09:31:44.826Z',
                        checked: false,
                    },
                    {
                        key: DaterangeKey.Last30Days,
                        docCount: 10,
                        from: '2023-12-05T09:31:44.826Z',
                        checked: true,
                    },
                    {
                        key: DaterangeKey.Last12Months,
                        docCount: 135,
                        from: '2023-01-04T09:31:44.826Z',
                        checked: false,
                    },
                    {
                        key: DaterangeKey.Over12Months,
                        docCount: 201,
                        to: '2023-01-04T09:31:44.826Z',
                        checked: false,
                    },
                ],
                docCount: 336,
                checked: true,
            },
        },
        hits: [
            {
                displayName: 'Økonomisk sosialhjelp',
                href: 'https://www.nav.no/okonomisk-sosialhjelp/nn',
                highlight:
                    'Ei mellombels støtte når du ikkje klarer å dekkje nødvendige utgifter på eiga hand. ',
                publish: {
                    first: '2023-03-28T15:28:58.022Z',
                    from: '2023-03-28T15:28:58.022Z',
                },
                createdTime: '2023-03-28T14:23:49.774Z',
                modifiedTime: '2024-01-02T10:46:08.682Z',
                score: 2.690218925476074,
                audience: ['person'],
                language: 'nn',
                hidePublishDate: true,
                hideModifiedDate: false,
                priority: false,
                displayPath: '/okonomisk-sosialhjelp',
            },
        ],
    };

    return result;
};
