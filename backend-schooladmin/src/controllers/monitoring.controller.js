import { monitoringService } from '../services/monitoring.service.js';
import { developerToolsService } from '../services/developerTools.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getServerStats = asyncHandler(async (req, res) => {
  const stats = await monitoringService.serverStats();
  return ok(res, stats);
});

export const getActiveAlerts = asyncHandler(async (req, res) => {
  const alerts = await monitoringService.activeAlerts();
  return ok(res, alerts);
});

export const getLogs = asyncHandler(async (req, res) => {
  const logs = await developerToolsService.searchLogs({ query: req.query.q, limit: 100 });
  return ok(res, logs);
});
