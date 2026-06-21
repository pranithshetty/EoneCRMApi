import { Router } from "express";
import { LoginSchema } from "../validators/login.schema";
import { authService } from "./auth.service";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
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
