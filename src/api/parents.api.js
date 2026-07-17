import { client, unwrap } from './client';

export const parentsApi = {
  list: (params) => unwrap(client.get('/school/parents', { params })),
  get: (id) => unwrap(client.get(`/school/parents/${id}`)),
  create: (payload) => unwrap(client.post('/school/parents', payload)),
  update: (id, payload) => unwrap(client.put(`/school/parents/${id}`, payload)),
  setInactive: (id, payload) => unwrap(client.post(`/school/parents/${id}/inactive`, payload)),
  setActive: (id) => unwrap(client.post(`/school/parents/${id}/activate`)),
};
