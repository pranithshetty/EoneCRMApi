import { NextFunction, Request, Response } from "express";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId =
    req.headers["x-request-id"] ||
    `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  req.headers["x-request-id"] = requestId as string;
  res.setHeader("x-request-id", requestId);
  next();
};
