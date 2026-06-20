import { withSupabase } from "@supabase/server";
import { env } from "../config/env";

export const supabaseUserHandler = withSupabase(
  { auth: "user" },
  async (_req, ctx) => {
    const { data, error } = await ctx.supabase
      .from("profiles")
      .select("id")
      .limit(1);

    return Response.json({
      configured: Boolean(
        env.SUPABASE_URL &&
        env.SUPABASE_PUBLISHABLE_KEY &&
        env.SUPABASE_JWKS_URL,
      ),
      authMode: ctx.authMode,
      user: ctx.userClaims,
      sampleProfiles: error ? [] : data,
      error: error?.message ?? null,
    });
  },
);

export const supabaseSecretHandler = withSupabase(
  { auth: "secret" },
  async (_req, ctx) => {
    const { data, error } = await ctx.supabaseAdmin
      .from("profiles")
      .select("id")
      .limit(1);

    return Response.json({
      configured: Boolean(env.SUPABASE_URL && env.SUPABASE_SECRET_KEY),
      authMode: ctx.authMode,
      sampleProfiles: error ? [] : data,
      error: error?.message ?? null,
    });
  },
);
