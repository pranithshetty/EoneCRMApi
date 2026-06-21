import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { leadRepository } from "./lead.repository";
import { supabaseUserHandler } from "../supabase/supabase.handler";

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
router.get("/", authMiddleware, async (_req, res, next) => {
  try {
    const leads = await leadRepository.findAll();
    res.json({ count: leads.length, leads });
  } catch (error) {
    next(error);
  }
});

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
router.get("/info", authMiddleware, async (_req, res, next) => {
  try {
    const leads = await leadRepository.findAll();
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
});

/**
 * @openapi
 * /api/v1/leads/supabase:
 *   get:
 *     summary: Fetch lead data through the Supabase handler
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: Supabase response payload
 */
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
