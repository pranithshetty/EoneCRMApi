import { Router } from "express";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware";
import { LeadWebhookSchema } from "../validators/leadWebhook.schema";
import { webhookService } from "./webhook.service";

const router = Router();

router.post("/leads", apiKeyMiddleware, async (req, res, next) => {
  try {
    const parsed = LeadWebhookSchema.parse(req.body);
    const result = await webhookService.processLead(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
