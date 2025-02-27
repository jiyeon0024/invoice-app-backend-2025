// src/types/express.d.ts

import { User } from "../entity/User";

declare global {
  namespace Express {
    interface Request {
      user?: User; // user 속성을 추가하고, User 타입을 사용
    }
  }
}
