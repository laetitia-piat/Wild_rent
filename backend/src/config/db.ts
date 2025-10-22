import { ProductInOrder } from "../entities/ProductInOrder";
import { DataSource } from "typeorm";
import { TempUser } from "../entities/TempUser";
import { Address } from "../entities/Address";
import { ProductOption } from "../entities/ProductOption";
import { Category } from "../entities/Category";
import { Order } from "../entities/Order";
import { Picture } from "../entities/Picture";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { Tag } from "../entities/Tag";
import dotenv from "dotenv";
dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.CI ? "localhost" : "db",
  username: "admin",
  password: "password",
  database: "db_wild_rent",
  entities: [
    User,
    ProductInOrder,
    Order,
    TempUser,
    Address,
    ProductOption,
    Category,
    Picture,
    Product,
    Tag,
  ],
  synchronize: true,
  logging: ["error", "query"],
});

console.log("host:",  process.env.CI ? "localhost" : "db", "username:", process.env.POSTGRES_USER, "database:", process.env.POSTGRES_DB, "password:", process.env.POSTGRES_PASSWORD )
