import { prisma } from '../config/prisma.js';
import { platformConfigRepository } from '../repositories/platformConfig.repository.js';
import { auditLogRepository } from '../repositories/auditLog.repository.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { ApiError } from '../utils/ApiError.js';

async function recordAudit({ action, adminId, adminName, reason, metadata }) {
  return auditLogRepository.record({ action, performedById: adminId, performedByName: adminName, reason, metadata });
}

export const emergencyService = {
  /**
   * Force logout — genuinely revokes every active refresh token
   * platform-wide (both platform admins and tenant users). Their
   * current access tokens remain valid until they expire (max 15 min
   * per JWT_ACCESS_EXPIRES_IN), but none can silently refresh afterward.
   */
  async forceLogoutAll({ adminId, adminName, reason }) {
    const result = await prisma.refreshToken.updateMany({
      where: { revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await recordAudit({
      action: 'FORCE_LOGOUT_ALL',
      adminId,
      adminName,
      reason,
      metadata: { revokedCount: result.count },
    });
    return { revokedCount: result.count };
  },

  /**
   * Maintenance mode is a real, checkable flag (platform_config key
   * "maintenanceMode") — a middleware can gate non-admin traffic on it.
   * This endpoint does NOT actually stop the Node process or containers;
   * true infrastructure shutdown belongs to your orchestration layer
   * (Phase 8), not application code.
   */
  async toggleMaintenanceMode({ adminId, adminName, reason, enabled }) {
    await platformConfigRepository.upsert('maintenanceMode', { enabled });
    await recordAudit({
      action: enabled ? 'PLATFORM_SHUTDOWN' : 'PLATFORM_RESUME',
      adminId,
      adminName,
      reason,
    });
    return { enabled };
  },

  /**
   * Deployment rollback cannot be performed from within the running
   * application — it requires your CI/CD or container platform. This
   * logs the request as an audit trail entry so a human/ops pipeline can
   * act on it; it does not silently pretend to roll back code.
   */
  async requestRollback({ adminId, adminName, reason }) {
    await recordAudit({ action: 'ROLLBACK_REQUESTED', adminId, adminName, reason });
    throw ApiError.badRequest(
      'Rollback must be triggered through your CI/CD pipeline. This request has been logged for the ops team — no in-app rollback mechanism exists yet (see Phase 8).'
    );
  },

  async broadcast({ adminId, adminName, title, message }) {
    if (!message?.trim()) throw ApiError.badRequest('Message is required');

    const schools = await prisma.school.findMany({
      where: { status: 'ACTIVE' },
      select: { contactEmail: true },
    });

    await Promise.all(
      schools.map((s) =>
        enqueueEmail({
          type: 'SYSTEM_ANNOUNCEMENT',
          to: s.contactEmail,
          params: { title: title || 'Emergency Notice', message },
        })
      )
    );

    await recordAudit({
      action: 'EMERGENCY_BROADCAST',
      adminId,
      adminName,
      reason: title || 'Emergency Notice',
      metadata: { recipientCount: schools.length },
    });

    return { sentTo: schools.length };
  },

  listAuditLog: (opts) => auditLogRepository.list(opts),
};
