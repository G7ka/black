import { client, unwrap } from './client';

export const attendanceApi = {
  overview: (date) => unwrap(client.get('/school/attendance', { params: { date } })),
};

export const timetableApi = {
  getForClass: (classId, streamId) => unwrap(client.get(`/school/timetable/${classId}`, { params: { streamId } })),
  saveSlot: (payload) => unwrap(client.post('/school/timetable', payload)),
  deleteSlot: (classId, params) => unwrap(client.delete(`/school/timetable/${classId}`, { params })),
};

export const feesApi = {
  listStructures: () => unwrap(client.get('/school/fees/structures')),
  saveStructure: (payload) => unwrap(client.post('/school/fees/structures', payload)),
  listPaymentStatus: (term) => unwrap(client.get('/school/fees/payments', { params: { term } })),
  recordPayment: (payload) => unwrap(client.post('/school/fees/payments', payload)),
  sendReminder: (studentId, term) => unwrap(client.post(`/school/fees/payments/${studentId}/remind`, { term })),
};

export const schoolConfigApi = {
  get: () => unwrap(client.get('/school/config')),
  getBilling: () => unwrap(client.get('/school/config/billing')),
  updateInfo: (payload) => unwrap(client.put('/school/config/info', payload)),
  updateTerms: (payload) => unwrap(client.put('/school/config/terms', payload)),
  updateNotifications: (payload) => unwrap(client.put('/school/config/notifications', payload)),
};

export const schoolAlertsApi = {
  list: () => unwrap(client.get('/school/alerts')),
  send: (payload) => unwrap(client.post('/school/alerts', payload)),
};

export const schoolReportsApi = {
  overview: (term) => unwrap(client.get('/school/reports/overview', { params: { term } })),
};

export const tenantSupportApi = {
  list: () => unwrap(client.get('/school/support')),
  create: (payload) => unwrap(client.post('/school/support', payload)),
  get: (id) => unwrap(client.get(`/school/support/${id}`)),
  reply: (id, body) => unwrap(client.post(`/school/support/${id}/reply`, { body })),
};
