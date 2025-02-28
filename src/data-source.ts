import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Invoice } from "./entity/Invoice";
import { Item } from "./entity/Items";
import "dotenv/config";
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [User, Invoice, Item],
  migrations: ["src/migration/**/*.ts"],
  ssl: { rejectUnauthorized: false },
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
