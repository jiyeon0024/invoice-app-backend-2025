import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

// 토큰 검증 함수
const verifyToken = (token: string, secret: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("🚨 Token Verification Error:", err);
        return reject(err); // error가 있을 경우 reject
      }

      // decoded가 User 타입인지 확인
      if (!decoded || !decoded.id) {
        return reject(new Error("유효하지 않은 토큰입니다"));
      }

      resolve(decoded as User); // 정상적인 User 객체 반환
    });
  });
};

// 리프레시 토큰을 통해 새로운 액세스 토큰 발급
const refreshAccessToken = async (refreshToken: string, res: Response) => {
  try {
    // 리프레시 토큰 검증
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY!
    );

    // 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.log("🚨 Refresh Token Error:", err);
    return res.status(403).json({
      message: "리프레시 토큰이 유효하지 않습니다",
      error: err.message,
    });
  }
};

// 액세스 토큰 검증 및 리프레시 토큰 발급 처리
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 헤더에서 액세스 토큰 추출
  const refreshToken = req.body.refreshToken; // 본문에서 리프레시 토큰 추출

  if (!token) {
    return res.status(401).json({ message: "액세스 토큰이 필요합니다" });
  }

  try {
    // 액세스 토큰 검증
    const user = await verifyToken(token, process.env.JWT_SECRET_KEY!);
    req.user = user; // 유효한 액세스 토큰인 경우 user 정보 추가
    return next();
  } catch (err) {
    console.log("잘못된 액세스 토큰:", err);

    // 액세스 토큰 만료 시 리프레시 토큰으로 새로운 액세스 토큰 발급
    if (err.name === "TokenExpiredError") {
      console.log("액세스 토큰 만료, 리프레시 토큰을 이용하여 새 토큰 발급");

      if (!refreshToken) {
        return res.status(401).json({ message: "리프레시 토큰이 필요합니다" });
      }

      return refreshAccessToken(refreshToken, res); // 리프레시 토큰으로 새 액세스 토큰 발급
    }

    return res.status(403).json({ message: "유효하지 않은 토큰입니다" });
  }
};
