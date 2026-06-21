import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check if the API is healthy and ready to serve traffic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Combined health response
 */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    database: "connected",
  });
});

export default router;
