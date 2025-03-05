import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Invoice } from "./entity/Invoice";
import { Item } from "./entity/Items";
import dotenv from "dotenv";
dotenv.config();
// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DATABASE_HOST,
//   port: Number(process.env.DATABASE_PORT),
//   username: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   synchronize: false, // 개발 중에는 true로 설정해 자동 동기화
//   logging: true, // 쿼리 로그를 확인하려면 true로 설정
//   entities: [User, Invoice, Item], // 개발 중에는 .ts 사용
//   migrations: ["src/migration/**/*.ts"], // 개발 중에는 .ts 사용
//   subscribers: [],
// });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // DATABASE_URL 환경 변수에서 가져오기
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
