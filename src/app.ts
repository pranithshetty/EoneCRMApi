import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./auth/auth.routes";
import webhookRoutes from "./webhooks/webhook.routes";
import leadRoutes from "./leads/lead.routes";
import healthRoutes from "./health/health.routes";
import supabaseRoutes from "./supabase/supabase.routes";
import { logger } from "./utils/logger";

dotenv.config();

export const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
  }),
);
app.use(express.json());
app.use(requestIdMiddleware);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/supabase", supabaseRoutes);
app.use("/health", healthRoutes);

app.use(errorMiddleware);

app.use((req, res) => {
  logger.warn({ requestId: req.headers["x-request-id"] }, "Route not found");
  res.status(404).json({ message: "Not found" });
});
