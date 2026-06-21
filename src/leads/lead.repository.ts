import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const leadRepository = {
  async findAll() {
    return prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async findAllForUser(userId: string) {
    return prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByPlatformLeadId(platformLeadId: string) {
    return prisma.lead.findUnique({
      where: { platformLeadId },
    });
  },

  async create(data: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    sourceType: string;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmAdset: string | null;
    utmAd: string | null;
    platformLeadId: string;
    platformFormId: string | null;
    landingPageUrl: string | null;
    rawPayload: Record<string, unknown>;
  }) {
    return prisma.lead.create({
      data: {
        ...data,
        userId: data.userId ?? null,
        rawPayload: data.rawPayload as Prisma.JsonObject,
      },
    });
  },
};
