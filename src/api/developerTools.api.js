import { client, unwrap } from './client';

export const developerToolsApi = {
  listApiKeys: () => unwrap(client.get('/admin/developer-tools/api-keys')),
  createApiKey: (name) => unwrap(client.post('/admin/developer-tools/api-keys', { name })),
  revokeApiKey: (id) => unwrap(client.post(`/admin/developer-tools/api-keys/${id}/revoke`)),
  searchLogs: (q) => unwrap(client.get('/admin/developer-tools/logs', { params: { q } })),
};
