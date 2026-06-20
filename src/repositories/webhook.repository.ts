import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const webhookRepository = {
  async createEvent(data: {
    source: string;
    externalId: string | null;
    payload: Record<string, unknown>;
    status: string;
    error?: string | null;
  }) {
    return prisma.webhookEvent.create({
      data: {
        source: data.source,
        externalId: data.externalId,
        payload: data.payload as Prisma.JsonObject,
        status: data.status,
        error: data.error ?? null,
      },
    });
  },
};
