import { withSupabase } from "@supabase/server";
import { env } from "../config/env";

export const supabaseUserHandler = withSupabase(
  { auth: "none" },
  async (_req, ctx) => {
    return Response.json({
      configured: Boolean(
        env.SUPABASE_URL &&
        env.SUPABASE_PUBLISHABLE_KEY &&
        env.SUPABASE_JWKS_URL,
      ),
      authMode: ctx.authMode,
      user: ctx.userClaims,
      sampleProfiles: [],
      error: null,
    });
  },
);

export const supabaseSecretHandler = withSupabase(
  { auth: "none" },
  async (_req, ctx) => {
    return Response.json({
      configured: Boolean(env.SUPABASE_URL && env.SUPABASE_SECRET_KEY),
      authMode: ctx.authMode,
      sampleProfiles: [],
      error: null,
    });
  },
);
