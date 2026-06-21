import { NextFunction, Request, Response } from "express";
import { apiKeyRepository } from "../repositories/apiKey.repository";

interface WebhookRequest extends Request {
  user?: {
    userId: string;
  };
}

export const apiKeyMiddleware = async (
  req: WebhookRequest,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || typeof apiKey !== "string") {
    return res.status(401).json({ message: "Invalid API key" });
  }

  const matchedKey = await apiKeyRepository.findByRawKey(apiKey);

  if (!matchedKey || !matchedKey.userId) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  req.user = { userId: matchedKey.userId };
  next();
};
