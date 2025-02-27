import express, { Router } from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import CircularJSON from "circular-json";
import cors from "cors";

import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { authenticateToken } from "./middlewares/authenticateToken";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(
      cors({
        origin: "http://localhost:3000", // 프론트엔드 주소
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // 쿠키와 인증 정보 전송 허용
      })
    );
    app.use(bodyParser.json());

    Routes.forEach((route) => {
      // 로그인 라우터에서는 authenticateToken 미들웨어를 제외
      const middlewares =
        route.route === "/login" || route.route === "/signup"
          ? []
          : [authenticateToken]; // 로그인 라우터만 제외

      (app as any)[route.method](
        route.route,
        ...middlewares, // 여기에 미들웨어를 추가
        (req: Request, res: Response, next: Function) => {
          const controller = new (route.controller as any)();

          const result = controller[route.action](req, res, next);

          if (result instanceof Promise) {
            result.then((result) => {
              if (!res.headersSent) {
                res.send(CircularJSON.stringify(req.socket));
              }
            });
          } else if (
            result !== null &&
            result !== undefined &&
            !res.headersSent
          ) {
            res.json(result);
          }
        }
      );
    });

    // start express server
    app.listen(8000);
    console.log(
      "Express server has started on port 8000. Open http://localhost:8000/users to see results"
    );
  })
  .catch((error) => console.log(error));
