import { UserController } from "./controller/UserController";
import { InvoiceController } from "./controller/InvoiceController";
import { authenticateToken } from "./middlewares/authenticateToken"; // 미들웨어 추가

export const Routes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "post",
    route: "/login",
    controller: UserController,
    action: "login",
  },
  {
    method: "post",
    route: "/signup",
    controller: UserController,
    action: "signup",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "get",
    route: "/invoices",
    controller: InvoiceController,
    action: "all",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "get",
    route: "/invoices/:id",
    controller: InvoiceController,
    action: "one",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "post",
    route: "/invoices",
    controller: InvoiceController,
    action: "save",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "put",
    route: "/invoices/:id",
    controller: InvoiceController,
    action: "put",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "delete",
    route: "/invoices/:id",
    controller: InvoiceController,
    action: "remove",
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
  {
    method: "post",
    route: "/refresh-token",
    controller: UserController,
    action: "refreshAccessToken", // 리프레시 토큰 발급 경로 추가
    middleware: [authenticateToken], // 토큰 검증 미들웨어 추가
  },
];
