import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export const authService = {
  async login(input: { email: string; password: string }) {
    logger.info({ email: input.email }, "Login attempted");

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

    // Placeholder authentication logic for scaffolding.
    if (input.email !== "admin@crm.com" || input.password !== "password") {
      logger.warn({ email: input.email }, "Invalid login attempt");
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const accessToken = jwt.sign(
      { userId: "demo-user-id", email: input.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    logger.info({ email: input.email }, "Login successful");

    return {
      accessToken,
      expiresIn: 900,
    };
  },
};
