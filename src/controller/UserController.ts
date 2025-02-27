import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    const users = await this.userRepository.find();
    return response.status(200).json(users);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(200).json(user);
  }

  async signup(request: Request, response: Response, next: NextFunction) {
    const { email, username, password } = request.body;

    if (!password) {
      return response.status(400).json({ message: "Password is required" });
    }

    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      return response.status(400).json({ message: "Email already in use" });
    }

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUserByUsername) {
      return response.status(400).json({ message: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return response.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const email = request.params.email;
    const userToRemove = await this.userRepository.findOne({
      where: { email },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User does not exist" });
    }

    await this.userRepository.remove(userToRemove);

    return response.status(200).json({ message: "User has been removed" });
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET_KEY || !process.env.JWT_REFRESH_SECRET_KEY) {
      throw new Error(
        "JWT_SECRET and JWT_REFRESH_SECRET environment variables are required"
      );
    }

    // 액세스 토큰 (1시간 만료)
    const accessTokenExpiresIn = "1h";

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY, // 고정된 JWT_SECRET_KEY 사용
      { expiresIn: accessTokenExpiresIn }
    );

    // 리프레시 토큰 (7일 만료)
    const refreshTokenExpiresIn = "7d";
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET_KEY, // 고정된 JWT_REFRESH_SECRET_KEY 사용
      { expiresIn: refreshTokenExpiresIn }
    );

    const accessTokenExpiryDate = new Date(Date.now() + 1000).toISOString(); // 1초 후
    const refreshTokenExpiryDate = new Date(
      Date.now() + 7 * 24 * 3600 * 1000
    ).toISOString(); // 7일 후

    const { password: _, ...userWithoutPassword } = user; // 비밀번호 제외

    return response.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      accessTokenExpiryDate,
      refreshTokenExpiryDate,
      user: userWithoutPassword,
    });
  }

  // 리프레시 토큰을 사용하여 액세스 토큰을 갱신하는 함수 추가
  async refreshAccessToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response
        .status(401)
        .json({ message: "Refresh token is required" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, user) => {
        if (err) {
          return response
            .status(403)
            .json({ message: "Invalid refresh token" });
        }

        // 새로운 액세스 토큰 발급

        const newAccessToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        return response.status(200).json({ accessToken: newAccessToken });
      }
    );
  }
}
