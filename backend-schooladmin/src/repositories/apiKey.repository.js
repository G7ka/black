import { prisma } from '../config/prisma.js';

export const apiKeyRepository = {
  findAll() {
    return prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
  },
  findById(id) {
    return prisma.apiKey.findUnique({ where: { id } });
  },
  findByHash(keyHash) {
    return prisma.apiKey.findUnique({ where: { keyHash } });
  },
  create(data) {
    return prisma.apiKey.create({ data });
  },
  revoke(id) {
    return prisma.apiKey.update({ where: { id }, data: { status: 'REVOKED', revokedAt: new Date() } });
  },
  touchLastUsed(id) {
    return prisma.apiKey.update({ where: { id }, data: { lastUsedAt: new Date() } });
  },
};
