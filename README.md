React/[Next.js](https://nextjs.org/) frontend for søk på nav.no 

## Lokal kjøring

Kjører lokalt på [http://localhost:3001](http://localhost:3001).

#### Development mode:
```
npm run dev
```

#### Production mode:
Kopier innhold fra .env.development til .env.local og kjør:

```
npm run build && npm start
```

## Deploy til dev-miljø

[Deploy-to-dev](https://github.com/navikt/navno-search-frontend/actions/workflows/deploy.dev.yml) -> Run workflow -> Velg branch -> Run workflow

## Prodsetting

Publiser en ny release på master for å starte deploy til prod
