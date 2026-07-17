import { client, unwrap } from './client';

export const configurationApi = {
  get: () => unwrap(client.get('/admin/configuration')),
  updateAppearance: (payload) => unwrap(client.put('/admin/configuration/appearance', payload)),
  updateBranding: (payload) => unwrap(client.put('/admin/configuration/branding', payload)),
  updateFeatures: (payload) => unwrap(client.put('/admin/configuration/features', payload)),
  updateSecurity: (payload) => unwrap(client.put('/admin/configuration/security', payload)),
  updateIntegrations: (payload) => unwrap(client.put('/admin/configuration/integrations', payload)),
};
