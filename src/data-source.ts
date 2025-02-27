import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Invoice } from "./entity/Invoice";
import { Item } from "./entity/Items";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5430,
  username: "jiyeon",
  password: "password",
  database: "invoice_db",
  synchronize: false, // 개발 중에는 true로 설정해 자동 동기화
  logging: true, // 쿼리 로그를 확인하려면 true로 설정
  entities: [User, Invoice, Item], // 개발 중에는 .ts 사용
  migrations: ["src/migration/**/*.ts"], // 개발 중에는 .ts 사용
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
