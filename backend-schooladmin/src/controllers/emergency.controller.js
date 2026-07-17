import { emergencyService } from '../services/emergency.service.js';
import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

async function adminContext(req) {
  const admin = await platformAdminRepository.findById(req.auth.sub);
  return { adminId: req.auth.sub, adminName: admin?.name || req.auth.sub };
}

export const forceLogoutAll = asyncHandler(async (req, res) => {
  const ctx = await adminContext(req);
  const result = await emergencyService.forceLogoutAll({ ...ctx, reason: req.body.reason });
  return ok(res, result, `Force-logged-out ${result.revokedCount} active sessions`);
});

export const shutdown = asyncHandler(async (req, res) => {
  const ctx = await adminContext(req);
  const result = await emergencyService.toggleMaintenanceMode({ ...ctx, reason: req.body.reason, enabled: true });
  return ok(res, result, 'Maintenance mode enabled');
});

export const resume = asyncHandler(async (req, res) => {
  const ctx = await adminContext(req);
  const result = await emergencyService.toggleMaintenanceMode({ ...ctx, reason: req.body.reason, enabled: false });
  return ok(res, result, 'Maintenance mode disabled');
});

export const rollback = asyncHandler(async (req, res) => {
  const ctx = await adminContext(req);
  await emergencyService.requestRollback({ ...ctx, reason: req.body.reason });
});

export const broadcast = asyncHandler(async (req, res) => {
  const ctx = await adminContext(req);
  const result = await emergencyService.broadcast({ ...ctx, title: req.body.title, message: req.body.message });
  return ok(res, result, `Broadcast sent to ${result.sentTo} schools`);
});

export const auditLog = asyncHandler(async (req, res) => {
  const logs = await emergencyService.listAuditLog({ take: 100 });
  return ok(res, logs);
});
