import crypto from 'crypto';
import { apiKeyRepository } from '../repositories/apiKey.repository.js';
import { ApiError } from '../utils/ApiError.js';

function hashKey(rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

export const apiKeyService = {
  list: () => apiKeyRepository.findAll(),

  // Returns the raw key exactly once (at creation). Only the hash and a
  // display prefix are ever persisted or returned afterward.
  async create({ name, createdById }) {
    const rawKey = `em_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = hashKey(rawKey);
    const keyPrefix = rawKey.slice(0, 16);

    const record = await apiKeyRepository.create({ name, keyHash, keyPrefix, createdById });
    return { record, rawKey };
  },

  async revoke(id) {
    const key = await apiKeyRepository.findById(id);
    if (!key) throw ApiError.notFound('API key not found');
    if (key.status === 'REVOKED') throw ApiError.conflict('Key is already revoked');
    return apiKeyRepository.revoke(id);
  },

  // Used by an API-key auth middleware in later phases when external
  // integrations are introduced.
  async verify(rawKey) {
    const keyHash = hashKey(rawKey);
    const record = await apiKeyRepository.findByHash(keyHash);
    if (!record || record.status !== 'ACTIVE') return null;
    await apiKeyRepository.touchLastUsed(record.id);
    return record;
  },
};
