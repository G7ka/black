import { developerToolsService } from '../services/developerTools.service.js';
import { toApiKeyDTO } from '../dtos/apiKey.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listApiKeys = asyncHandler(async (req, res) => {
  const keys = await developerToolsService.list();
  return ok(res, keys.map(toApiKeyDTO));
});

export const createApiKey = asyncHandler(async (req, res) => {
  const { record, rawKey } = await developerToolsService.create({
    name: req.body.name,
    createdById: req.auth.sub,
  });
  // rawKey is returned exactly once — the client must capture it now.
  return created(res, { ...toApiKeyDTO(record), key: rawKey }, 'API key generated');
});

export const revokeApiKey = asyncHandler(async (req, res) => {
  const key = await developerToolsService.revoke(req.params.id);
  return ok(res, toApiKeyDTO(key), 'API key revoked');
});

export const searchLogs = asyncHandler(async (req, res) => {
  const logs = await developerToolsService.searchLogs({ query: req.query.q });
  return ok(res, logs);
});
