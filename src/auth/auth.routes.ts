import { Router } from "express";
import { LoginSchema } from "../validators/login.schema";
import { authService } from "./auth.service";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const parsed = LoginSchema.parse(req.body);
    const result = await authService.login(parsed);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
