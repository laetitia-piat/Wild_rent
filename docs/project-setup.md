# Project Initialization

## Backend
1. TypeORM
```bash
npm init
npm install typeorm
```

2. ApolloServer
```bash
npm install @apollo/server graphq
```

3. Compileur Typescript
```bash
npm install ts-node-dev
```

4. GraphQL
```bash
npm install graphql
```

5. PostgreSQL
```bash
npm install pg 
```

6. Decorateur
```bash
npm install reflect-metadata
```

7. CORS
```bash
npm install cors
```

8. Dotenv 
```bash
npm install dotenv
```

### Backend - Dockerfile 

```docker
FROM node:lts-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY src src
COPY tsconfig.json tsconfig.json

CMD npm start
```

### Frontend - Dockerfile 

```docker
FROM node:lts-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY public public
COPY src src
COPY codegen.ts codegen.ts
COPY index.html index.html
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts

CMD npm run start
```

### Docker composer yaml 
```docker
test: [ "CMD-SHELL", "pg_isready -d postgres -U postgres" ]
```
-d -> database name

-U -> username

## Frontend

```bash
npm create vite@latest
```

```bash
npm install @apollo/client graphql
```

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

```bash
npm install react-router-dom
```

```bash
npm install tailwindcss @tailwindcss/vite
```

Récupérer le fichier ts.node.dev de la doc (ou repo existant)


## Arborescence

```bash
root
├── backend
│   ├── node_modules
│   ├── src
│   │   ├── config
│   │   ├── entities
│   │   ├── resolvers
│   ├── docker-compose.yaml
│   ├── nginx.conf
│   ├── .gitignore
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── .env.example
│── frontend
│   │── public
│   │── src
│   │   │── assets
│   │   │── components
│   │   │── generated
│   │   │── graphql
│   │   │── pages
│   │   │── App.css
│   │   │── App.tsx
│   │   │── index.css
│   │   │── main.tsx
│   │   │── vite-env.d.ts
│   │── .gitignore
│   │── codegen.ts
│   │── Dockerfile
│   │── eslint.config.js
│   │── index.html
│   │── package-lock.json
│   │── package.json
│   │── README.md
│   │── tsconfig.app.json
│   │── tsconfig.json
│   │── tsconfig.node.json
│   │── vite.config.ts
├── package-lock.json
├── package.json
├── Dockerfile
├── index.ts
├── .env
├── .gitignore
```
