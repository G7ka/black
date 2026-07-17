import { client, unwrap } from './client';

export const platformAdminsApi = {
  list: () => unwrap(client.get('/admin/platform-admins')),
  create: (payload) => unwrap(client.post('/admin/platform-admins', payload)),
  remove: (id) => unwrap(client.delete(`/admin/platform-admins/${id}`)),
};
