import dotenv from "dotenv";

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || process.env.SUPABASE_POSTGRESS_DB_URL || "";

export const env = {
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: databaseUrl,
  JWT_SECRET: process.env.JWT_SECRET || "development-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS || 12),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  WEBHOOK_API_KEY: process.env.WEBHOOK_API_KEY || "",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || "",
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || "",
  SUPABASE_JWKS_URL: process.env.SUPABASE_JWKS_URL || "",
};
