import { Request, Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { leadRepository } from "./lead.repository";
import { supabaseUserHandler } from "../supabase/supabase.handler";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const router = Router();

/**
 * @openapi
 * /api/v1/leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 */
router.get(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const leads = await leadRepository.findAllForUser(userId);
      res.json({ count: leads.length, leads });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @openapi
 * /api/v1/leads/info:
 *   get:
 *     summary: Get summarized lead information
 *     tags: [Leads]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Summarized leads information
 */
router.get(
  "/info",
  authMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const leads = await leadRepository.findAllForUser(userId);
      res.json({
        count: leads.length,
        leads: leads.map((lead) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          sourceType: lead.sourceType,
          platformLeadId: lead.platformLeadId,
          createdAt: lead.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @openapi
 * /api/v1/leads/supabase:
 *   get:
 *     summary: Fetch lead data through the Supabase handler
 *     tags: [Leads]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Supabase response payload
 */
router.get("/supabase", authMiddleware, async (req, res, next) => {
  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item) {
            headers.append(key, item);
          }
        }
      } else if (typeof value === "string") {
        headers.set(key, value);
      }
    }

    const request = new Request(
      `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      {
        method: req.method,
        headers,
      },
    );

    const response = await supabaseUserHandler(request);
    const body = await response.json();
    res.status(response.status).json(body);
  } catch (error) {
    next(error);
  }
});

export default router;
