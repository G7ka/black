import { client, unwrap } from './client';

export const studentsApi = {
  list: (params) => unwrap(client.get('/school/students', { params })),
  get: (id) => unwrap(client.get(`/school/students/${id}`)),
  enroll: (payload) => unwrap(client.post('/school/students', payload)),
  relocate: (id, payload) => unwrap(client.post(`/school/students/${id}/relocate`, payload)),
  promote: (id) => unwrap(client.post(`/school/students/${id}/promote`)),
  markRepeating: (id, reason) => unwrap(client.post(`/school/students/${id}/repeat`, { reason })),
  bulkPromote: (decisions) => unwrap(client.post('/school/students/bulk-promote', { decisions })),
};
