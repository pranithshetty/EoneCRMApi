import {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
} from "express";
import { supabaseSecretHandler, supabaseUserHandler } from "./supabase.handler";

const router = Router();

const buildFetchRequest = (req: ExpressRequest) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          headers.append(key, item);
        }
      }
    } else if (typeof value === "string") {
      headers.set(key, value);
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.body && req.method !== "GET" && req.method !== "HEAD") {
    headers.set("content-type", "application/json");
    init.body = JSON.stringify(req.body);
  }

  return new globalThis.Request(
    `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    init,
  );
};

const sendFetchResponse = async (
  res: ExpressResponse,
  response: globalThis.Response,
) => {
  const text = await response.text();
  res.status(response.status);

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  res.send(text);
};

const invokeHandler = async (
  handler: (req: globalThis.Request) => Promise<globalThis.Response>,
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const response = await handler(buildFetchRequest(req));
    await sendFetchResponse(res, response);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /supabase/user:
 *   get:
 *     summary: Get the current Supabase user context
 *     tags: [Supabase]
 *     responses:
 *       200:
 *         description: Supabase user context response
 */
router.get("/user", async (req, res, next) => {
  await invokeHandler(supabaseUserHandler, req, res, next);
});

/**
 * @openapi
 * /supabase/admin:
 *   get:
 *     summary: Get the Supabase admin context response
 *     tags: [Supabase]
 *     responses:
 *       200:
 *         description: Supabase admin response
 */
router.get("/admin", async (req, res, next) => {
  await invokeHandler(supabaseSecretHandler, req, res, next);
});

export default router;
