import { client, unwrap } from './client';

export const teachersApi = {
  list: (status) => unwrap(client.get('/school/teachers', { params: { status } })),
  get: (id) => unwrap(client.get(`/school/teachers/${id}`)),
  create: (payload) => unwrap(client.post('/school/teachers', payload)),
  setOnLeave: (id, payload) => unwrap(client.post(`/school/teachers/${id}/leave`, payload)),
  setActive: (id) => unwrap(client.post(`/school/teachers/${id}/activate`)),
  setInactive: (id) => unwrap(client.post(`/school/teachers/${id}/deactivate`)),
  assignClasses: (id, assignments) => unwrap(client.put(`/school/teachers/${id}/classes`, { assignments })),
  listAbsenceReports: () => unwrap(client.get('/school/teachers/absence-reports')),
  reviewAbsenceReport: (id) => unwrap(client.post(`/school/teachers/absence-reports/${id}/review`)),
};
