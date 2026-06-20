import { z } from "zod";
import { leadRepository } from "../leads/lead.repository";
import { webhookRepository } from "../repositories/webhook.repository";
import { logger } from "../utils/logger";
import { LeadWebhookSchema } from "../validators/leadWebhook.schema";

export const webhookService = {
  async processLead(input: z.infer<typeof LeadWebhookSchema>) {
    const { lead } = input;

    const platformLeadId = lead.platform_lead_id;

    logger.info(
      {
        requestId: platformLeadId,
        event: "lead_received",
        platformLeadId,
      },
      "Webhook received",
    );

    try {
      await webhookRepository.createEvent({
        source: "zapier",
        externalId: platformLeadId,
        payload: input,
        status: "PROCESSING",
      });

      const existingLead =
        await leadRepository.findByPlatformLeadId(platformLeadId);

      if (existingLead) {
        logger.info({ platformLeadId }, "Duplicate lead detected");
        await webhookRepository.createEvent({
          source: "zapier",
          externalId: platformLeadId,
          payload: input,
          status: "PROCESSED",
          error: "Duplicate lead detected",
        });
        return { success: true, duplicate: true };
      }

      const createdLead = await leadRepository.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        sourceType: lead.source_type,
        utmSource: lead.utm_source || null,
        utmMedium: lead.utm_medium || null,
        utmCampaign: lead.utm_campaign || null,
        utmAdset: lead.utm_adset || null,
        utmAd: lead.utm_ad || null,
        platformLeadId,
        platformFormId: lead.platform_form_id || null,
        landingPageUrl: null,
        rawPayload: input,
      });

      await webhookRepository.createEvent({
        source: "zapier",
        externalId: platformLeadId,
        payload: input,
        status: "PROCESSED",
      });

      logger.info({ platformLeadId, leadId: createdLead.id }, "Lead created");

      return {
        success: true,
        leadId: createdLead.id,
        duplicate: false,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error(
        { platformLeadId, error: message },
        "Lead processing failed",
      );

      await webhookRepository.createEvent({
        source: "zapier",
        externalId: platformLeadId,
        payload: input,
        status: "FAILED",
        error: message,
      });

      throw error;
    }
  },
};
