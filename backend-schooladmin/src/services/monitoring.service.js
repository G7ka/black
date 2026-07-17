import os from 'os';
import { prisma } from '../config/prisma.js';

/**
 * All values below are real: process.uptime()/os.loadavg()/os.freemem()
 * are genuine Node/OS metrics for the machine running this process.
 * "Active users" is a real count of non-revoked refresh tokens
 * (i.e. currently logged-in sessions), not a fabricated number.
 * Historical/graphed time-series server metrics (the frontend mock's
 * CPU/memory sparkline) require a metrics pipeline (Prometheus/Grafana)
 * — that's a Phase 8 concern, not something to fake here.
 */
export const monitoringService = {
  async serverStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemPct = Math.round(((totalMem - freeMem) / totalMem) * 100);
    const [load1] = os.loadavg();
    const cpuCount = os.cpus().length;
    const cpuLoadPct = Math.min(100, Math.round((load1 / cpuCount) * 100));

    const activeSessions = await prisma.refreshToken.count({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
    });

    return {
      cpuLoadPct,
      memoryUsedPct: usedMemPct,
      processUptimeSeconds: Math.round(process.uptime()),
      activeSessions,
    };
  },

  // Derives alerts from real conditions instead of hardcoding sample text.
  async activeAlerts() {
    const alerts = [];

    const overdueInvoices = await prisma.invoice.count({ where: { status: 'OVERDUE' } });
    if (overdueInvoices > 0) {
      alerts.push({
        level: 'warning',
        message: `${overdueInvoices} school invoice(s) overdue`,
        createdAt: new Date(),
      });
    }

    const recentFailedMail = await prisma.emailLog.count({
      where: { status: 'FAILED', createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (recentFailedMail > 0) {
      alerts.push({
        level: 'critical',
        message: `${recentFailedMail} email delivery failure(s) in the last 24 hours`,
        createdAt: new Date(),
      });
    }

    const maintenance = await prisma.platformConfig.findUnique({ where: { key: 'maintenanceMode' } });
    if (maintenance?.value?.enabled) {
      alerts.push({ level: 'critical', message: 'Platform is in maintenance mode', createdAt: new Date() });
    }

    return alerts;
  },
};
