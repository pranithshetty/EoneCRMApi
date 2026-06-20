import { z } from "zod";

export const LeadWebhookSchema = z.object({
  lead: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    source_type: z.string().min(1),
    utm_source: z.string().optional().default(""),
    utm_medium: z.string().optional().default(""),
    utm_campaign: z.string().optional().default(""),
    utm_adset: z.string().optional().default(""),
    utm_ad: z.string().optional().default(""),
    platform_lead_id: z.string().min(1),
    platform_form_id: z.string().optional().default(""),
  }),
});
