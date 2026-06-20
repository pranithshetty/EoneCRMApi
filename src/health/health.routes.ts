import { Router } from "express";

const router = Router();

router.get("/live", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/ready", (_req, res) => {
  res.json({ status: "ok", database: "connected" });
});

export default router;
