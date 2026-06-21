import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { userRepository } from "../repositories/user.repository";

const SUPABASE_AUTH_ENABLED = Boolean(
  env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY,
);

async function trySupabasePasswordLogin(input: {
  email: string;
  password: string;
}) {
  if (!SUPABASE_AUTH_ENABLED) {
    return null;
  }

  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      access_token?: string;
      user?: { id?: string; email?: string };
    };

    if (!data.access_token) {
      return null;
    }

    return {
      user: {
        id: data.user?.id || "supabase-user",
        email: data.user?.email || input.email,
        name: null,
      },
      accessToken: data.access_token,
      expiresIn: 900,
    };
  } catch (error) {
    logger.warn(
      { err: error, email: input.email },
      "Supabase login fallback failed",
    );
    return null;
  }
}

async function trySupabaseSignUp(input: {
  email: string;
  password: string;
  name?: string;
}) {
  if (!SUPABASE_AUTH_ENABLED) {
    return null;
  }

  try {
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        data: input.name ? { full_name: input.name } : undefined,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      access_token?: string;
      user?: { id?: string; email?: string };
    };

    if (!data.access_token) {
      return null;
    }

    return {
      user: {
        id: data.user?.id || "supabase-user",
        email: data.user?.email || input.email,
        name: input.name || null,
      },
      accessToken: data.access_token,
      expiresIn: 900,
    };
  } catch (error) {
    logger.warn(
      { err: error, email: input.email },
      "Supabase registration fallback failed",
    );
    return null;
  }
}

export const authService = {
  async register(input: { email: string; password: string; name?: string }) {
    logger.info({ email: input.email }, "Registration attempted");

    const supabaseResult = await trySupabaseSignUp(input);
    if (supabaseResult) {
      logger.info(
        { email: input.email },
        "Registration successful via Supabase",
      );
      return supabaseResult;
    }

    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      logger.warn(
        { email: input.email },
        "Registration failed: email already in use",
      );
      throw Object.assign(new Error("Email already in use"), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    logger.info({ email: input.email }, "Registration successful");

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      expiresIn: 900,
    };
  },

  async login(input: { email: string; password: string }) {
    logger.info({ email: input.email }, "Login attempted");

    const supabaseResult = await trySupabasePasswordLogin(input);
    if (supabaseResult) {
      logger.info({ email: input.email }, "Login successful via Supabase");
      return supabaseResult;
    }

    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      logger.warn(
        { email: input.email },
        "Invalid login attempt: user not found",
      );
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      logger.warn(
        { email: input.email },
        "Invalid login attempt: bad password",
      );
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );

    logger.info({ email: input.email }, "Login successful");

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      expiresIn: 900,
    };
  },
};
