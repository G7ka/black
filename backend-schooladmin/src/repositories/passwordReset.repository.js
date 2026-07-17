import { prisma } from '../config/prisma.js';

export const passwordResetRepository = {
  create(data) {
    return prisma.passwordResetToken.create({ data });
  },
  findLatestActive(ownerType, ownerId) {
    return prisma.passwordResetToken.findFirst({
      where: { ownerType, ownerId, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  },
  markConsumed(id) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { consumedAt: new Date() },
    });
  },
  invalidateAllForOwner(ownerType, ownerId) {
    return prisma.passwordResetToken.updateMany({
      where: { ownerType, ownerId, consumedAt: null },
      data: { consumedAt: new Date() },
    });
  },
};
