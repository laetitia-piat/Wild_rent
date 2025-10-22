import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { dataSource } from "./config/db";
import { createFixtures } from "./fixtures/fixtures";
import { getSchema } from "./schema";
import { ContextType, getUserFromContext } from "./auth";

const start = async () => {
  await dataSource.initialize();

  // Active l'extension 'unaccent' sur postgress pour des recherches qui ne prend pas en compte les accents
  try {
    await dataSource.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
    console.log("✔ Extension unaccent activée");
  } catch (err) {
    console.warn("⚠ Impossible d'activer unaccent :", err.message);
  }

  if (process.env.FIXTURES) {
    await createFixtures();
  }

  const schema = await getSchema();

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
      const context: ContextType = {
        req,
        res,
        user: undefined,
      };
      const user = await getUserFromContext(context);
      context.user = user;
      return context;
    },
  });
  console.log(`🚀 Server listening at: ${url}`);
};

start();
