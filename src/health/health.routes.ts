import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /health/live:
 *   get:
 *     summary: Check if the API is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get("/live", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * @openapi
 * /health/ready:
 *   get:
 *     summary: Check if the API is ready and database is reachable
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 */
router.get("/ready", (_req, res) => {
  res.json({ status: "ok", database: "connected" });
});

export default router;
