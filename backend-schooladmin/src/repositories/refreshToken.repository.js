import crypto from 'crypto';
import { prisma } from '../config/prisma.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const refreshTokenRepository = {
  async store({ token, ownerType, ownerId, schoolId, expiresAt }) {
    return prisma.refreshToken.create({
      data: { tokenHash: hashToken(token), ownerType, ownerId, schoolId, expiresAt },
    });
  },
  async findValid(token) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash: hashToken(token), revokedAt: null, expiresAt: { gt: new Date() } },
    });
  },
  async revoke(token) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() },
    });
  },
  async revokeAllForOwner(ownerType, ownerId) {
    return prisma.refreshToken.updateMany({
      where: { ownerType, ownerId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
