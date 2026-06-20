import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== env.WEBHOOK_API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  next();
};
