import { client, unwrap } from './client';

export const billingApi = {
  list: () => unwrap(client.get('/admin/billing')),
  setPrice: (pricePerStudent) => unwrap(client.put('/admin/billing/price', { pricePerStudent })),
  remind: (schoolId) => unwrap(client.post(`/admin/billing/${schoolId}/remind`)),
};
