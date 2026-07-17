import { client, unwrap } from './client';

export const emergencyApi = {
  forceLogoutAll: (reason) => unwrap(client.post('/admin/emergency/force-logout', { reason })),
  shutdown: (reason) => unwrap(client.post('/admin/emergency/shutdown', { reason })),
  resume: (reason) => unwrap(client.post('/admin/emergency/resume', { reason })),
  rollback: (reason) => unwrap(client.post('/admin/emergency/rollback', { reason })),
  broadcast: (title, message) => unwrap(client.post('/admin/emergency/broadcast', { title, message })),
  auditLog: () => unwrap(client.get('/admin/emergency/audit-log')),
};
