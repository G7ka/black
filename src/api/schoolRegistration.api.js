import { client, unwrap } from './client';

export const schoolRegistrationApi = {
  checkSubdomain: (subdomain) =>
    unwrap(client.get('/schools/check-subdomain', { params: { subdomain } })),

  getPricing: () =>
    unwrap(client.get('/schools/pricing')),

  searchSchools: (query) =>
    unwrap(client.get('/schools/search', {
      params: { q: query },
    })),

  // FormData — must include licenseFile as a File under that key.
  register: (formData) =>
    unwrap(client.post('/schools/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })),
};