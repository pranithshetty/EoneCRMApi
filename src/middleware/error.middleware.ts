import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(
    { err, requestId: req.headers["x-request-id"] },
    "Unhandled error",
  );

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
