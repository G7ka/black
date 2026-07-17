import { apiKeyService } from './apiKey.service.js';
import { emailLogRepository } from '../repositories/emailLog.repository.js';
import { auditLogRepository } from '../repositories/auditLog.repository.js';

export const developerToolsService = {
  ...apiKeyService,

  /**
   * Real, DB-backed activity feed — merges email delivery logs and
   * platform admin audit actions, newest first. Deliberately does NOT
   * fabricate HTTP request/response logs; a proper request-logging
   * pipeline (e.g. persisted access logs or an APM tool) is a Phase 8
   * production-readiness concern.
   */
  async searchLogs({ query, limit = 50 }) {
    const [emails, audits] = await Promise.all([
      emailLogRepository.list({ take: limit }),
      auditLogRepository.list({ take: limit }),
    ]);

    const merged = [
      ...emails.map((e) => ({
        timestamp: e.createdAt,
        level: e.status === 'FAILED' ? 'ERROR' : 'INFO',
        source: 'MAIL',
        message: `[${e.type}] to=${e.recipient} subject="${e.subject}"${e.error ? ` error="${e.error}"` : ''}`,
      })),
      ...audits.map((a) => ({
        timestamp: a.createdAt,
        level: 'INFO',
        source: 'AUDIT',
        message: `[${a.action}] by=${a.performedByName}${a.reason ? ` reason="${a.reason}"` : ''}`,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    const filtered = query
      ? merged.filter((l) => l.message.toLowerCase().includes(query.toLowerCase()))
      : merged;

    return filtered.slice(0, limit);
  },
};
