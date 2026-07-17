import { prisma } from '../config/prisma.js';

export const platformConfigRepository = {
  get(key) {
    return prisma.platformConfig.findUnique({ where: { key } });
  },
  upsert(key, value) {
    return prisma.platformConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },
  getMany(keys) {
    return prisma.platformConfig.findMany({ where: { key: { in: keys } } });
  },
};
