# Frontend for søk på nav.no 

## Lokal kjøring

Kjører lokalt på [http://localhost:3001/sok](http://localhost:3001/sok).

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
Lag en PR til main, og merge inn etter godkjenning (En automatisk release vil oppstå ved deploy til main)