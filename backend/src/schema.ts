import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { ProductOptionResolver } from "./resolvers/ProductOptionResolver";
import { TagResolver } from "./resolvers/TagResolver";
import { authChecker } from "./auth";
import { OrderResolver } from "./resolvers/OrderResolver";
import { TempUserResolver } from "./resolvers/TempUserResolver";
import { InventoryResolver } from "./resolvers/InventoryResolver";
import PaymentResolver from "./resolvers/PaymentResolver";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CategoryResolver,
      ProductResolver,
      ProductOptionResolver,
      OrderResolver,
      TagResolver,
      TempUserResolver,
      InventoryResolver,
      PaymentResolver,
    ],
    authChecker,
  });

  return schema;
}
