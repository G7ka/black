import { client, unwrap } from './client';

export const schoolsAdminApi = {
  list: (params) => unwrap(client.get('/admin/schools', { params })),
  get: (id) => unwrap(client.get(`/admin/schools/${id}`)),
  approve: (id) => unwrap(client.post(`/admin/schools/${id}/approve`)),
  reject: (id, reason) => unwrap(client.post(`/admin/schools/${id}/reject`, { reason })),
  suspend: (id, reason) => unwrap(client.post(`/admin/schools/${id}/suspend`, { reason })),
  reactivate: (id) => unwrap(client.post(`/admin/schools/${id}/reactivate`)),
  remove: (id) => unwrap(client.delete(`/admin/schools/${id}`)),
  rename: (id, newName) => unwrap(client.patch(`/admin/schools/${id}/name`, { newName })),
  impersonate: (id) => unwrap(client.post(`/admin/schools/${id}/impersonate`)),
  create: (payload) => unwrap(client.post('/admin/schools', payload)),
};
