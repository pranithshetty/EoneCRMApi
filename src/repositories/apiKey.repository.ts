import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

export const apiKeyRepository = {
  async findByRawKey(rawKey: string) {
    const apiKeys = await prisma.apiKey.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    for (const apiKey of apiKeys) {
      const isMatch = await bcrypt.compare(rawKey, apiKey.keyHash);
      if (isMatch) {
        return apiKey;
      }
    }

    return null;
  },
};
