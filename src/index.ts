import express, { Router } from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import CircularJSON from "circular-json";
import cors from "cors";
import "dotenv/config";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { authenticateToken } from "./middlewares/authenticateToken";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const frontendUrl: string =
      process.env.FRONTEND_URL ||
      "https://invoice-app-frontend-2025.vercel.app";

    app.use(
      cors({
        origin: frontendUrl,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );
    app.use(bodyParser.json());

    if (Array.isArray(Routes)) {
      Routes.forEach((route) => {
        if (
          route?.route &&
          route?.method &&
          route?.controller &&
          route?.action
        ) {
          const middlewares =
            route.route === "/login" || route.route === "/signup"
              ? []
              : [authenticateToken];

          (app as any)[route.method](
            route.route,
            ...middlewares,
            async (req: Request, res: Response, next: Function) => {
              const controller = new (route.controller as any)();

              try {
                const result = await controller[route.action](req, res, next);

                if (
                  result !== null &&
                  result !== undefined &&
                  !res?.headersSent
                ) {
                  res.json(result);
                }
              } catch (error) {
                next(error);
              }
            }
          );
        }
      });
    } else {
      console.error("Routes is not an array or is undefined");
    }

    const port: number = Number(process.env.PORT) || 8080;
    console.log(process.env.DATABASE_URL);

    app.listen(8080, "0.0.0.0", () => {
      console.log("Server is listening on 0.0.0.0:8080");
    });
  })
  .catch((error) => console.log(error));
