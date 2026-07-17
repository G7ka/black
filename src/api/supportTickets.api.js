import { client, unwrap } from './client';

export const supportTicketsApi = {
  list: (params) => unwrap(client.get('/admin/support-tickets', { params })),
  get: (id) => unwrap(client.get(`/admin/support-tickets/${id}`)),
  reply: (id, body) => unwrap(client.post(`/admin/support-tickets/${id}/reply`, { body })),
  resolve: (id) => unwrap(client.post(`/admin/support-tickets/${id}/resolve`)),
  stats: () => unwrap(client.get('/admin/support-tickets/stats')),
};
