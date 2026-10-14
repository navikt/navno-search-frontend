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

## Rollback

[Roll back prod](https://github.com/navikt/navno-search-frontend/actions/workflows/rollback.prod.yml) -> Run workflow -> Oppgi release-tag (tom = releasen før den nyeste) -> Run workflow

Redeployer imaget fra en tidligere release uten å bygge på nytt. Neste push til main deployer main igjen, så revert eller fiks på main før noe annet merges.

## Oppdatering av base-image

[Refresh base image](https://github.com/navikt/navno-search-frontend/actions/workflows/base-image-refresh.yml) bygger og deployer main til prod hver søndag kveld, slik at imaget får nyeste base-image. Kan også kjøres manuelt fra main.