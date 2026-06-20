import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { supabaseUserHandler } from "../supabase/supabase.handler";

const router = Router();

router.get("/", authMiddleware, (_req, res) => {
  res.json({ message: "Protected leads endpoint" });
});

router.get("/supabase", async (req, res, next) => {
  try {
    const response = await supabaseUserHandler(req as any);
    const body = await response.json();
    res.status(response.status).json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
