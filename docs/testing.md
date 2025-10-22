# CLI

## e2e with docker

```bash
docker compose -f docker-compose.e2e.yml up --build --exit-code-from e2e
``` 

## Local testing 

```bash
LOCAL=TRUE npx playwright test --headed
LOCAL=TRUE npx playwright test --ui
``` 

## Local testing frontend 
Dans le dossier frontend, après avoir lancé docker

```bash 
npm run test
``` 

## Launch playwright inspector 
In e2e folder

```bash
npx playwright codegen
``` 
