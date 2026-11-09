# Frontend for søk på nav.no

Søkesiden på [nav.no/sok](https://www.nav.no/sok): søkefelt, filtre og treffliste, med treff fra navno-search-api.

En Hono-server rendrer React-appen ([client/App.tsx](client/App.tsx)) med Aksel, og nettleseren hydrerer den, som i tilbakemeldinger og nav-office-search. Deretter søker appen selv via `/sok/api/search` og oppdaterer adressen uten nye innslag i historikken. Siden er også et vanlig GET-skjema, så søket virker før hydreringen og uten JavaScript. Vite bygger både klienten og serveren.

## Lokal kjøring

```
pnpm dev
```

Kjører på [http://localhost:3001/sok](http://localhost:3001/sok) med verdiene i `.env.development`. I podden kommer de fra `.nais/config.yml`. En endring i `client/` byttes inn uten å laste siden, og en endring i `server/` laster siden på nytt.

Bygget, slik det kjører i podden:

```
pnpm build && pnpm start
```

Serverbygget pakker inn alle avhengighetene, så imaget har bare `dist` og `package.json`, uten `node_modules`. Derfor lager CI SBOM-en fra `pnpm-lock.yaml` (`sbom-from-lockfile` i navno-ci) i stedet for fra imaget. Det som havner i bygget, hører hjemme i `dependencies`.

## Tester

- `pnpm test`: enhetstestene
- `pnpm test:dist`: kjører bygget uten `node_modules`, slik imaget gjør, og sjekker siden, klientfilene og probene. Krever `pnpm build` først; CI kjører den etter bygget
- `pnpm lint`: oxfmt, oxlint og TypeScript

## Deploy til dev-miljø

[Deploy-to-dev](https://github.com/navikt/navno-search-frontend/actions/workflows/deploy.dev.yml) -> Run workflow -> Velg branch -> Run workflow

## Prodsetting

Lag en PR til main, og merge inn etter godkjenning (En automatisk release vil oppstå ved deploy til main)

## Rollback

[Roll back prod](https://github.com/navikt/navno-search-frontend/actions/workflows/rollback.prod.yml) -> Run workflow -> Oppgi release-tag (tom = releasen før den nyeste) -> Run workflow

Redeployer imaget fra en tidligere release uten å bygge på nytt. Neste push til main deployer main igjen, så revert eller fiks på main før noe annet merges.

## Oppdatering av base-image

[Refresh base image](https://github.com/navikt/navno-search-frontend/actions/workflows/base-image-refresh.yml) bygger og deployer main til prod hver søndag kveld, slik at imaget får nyeste base-image. Kan også kjøres manuelt fra main.
