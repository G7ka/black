import { client, unwrap } from './client';

export const analyticsApi = {
  overview: () => unwrap(client.get('/admin/analytics/overview')),
  growth: () => unwrap(client.get('/admin/analytics/growth')),
};

export const monitoringApi = {
  stats: () => unwrap(client.get('/admin/monitoring/stats')),
  alerts: () => unwrap(client.get('/admin/monitoring/alerts')),
  logs: () => unwrap(client.get('/admin/monitoring/logs')),
};

export const notificationsApi = {
  sendToSchool: (schoolId, messageType, message) =>
    unwrap(client.post('/admin/notifications/school-message', { schoolId, messageType, message })),
};
