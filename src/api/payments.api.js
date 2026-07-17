import { client, unwrap } from './client';

export const paymentsApi = {
  initiate: (schoolId) => unwrap(client.post(`/admin/billing/${schoolId}/initiate-payment`)),
  getLatestTransaction: (schoolId) => unwrap(client.get(`/admin/billing/${schoolId}/transaction`)),
  refund: (schoolId, amount, remarks) => unwrap(client.post(`/admin/billing/${schoolId}/refund`, { amount, remarks })),
  cancel: (schoolId) => unwrap(client.post(`/admin/billing/${schoolId}/cancel-payment`)),
  // Public — no auth header needed/used, called from the payer-facing callback page.
  getPublicStatus: (orderTrackingId) => unwrap(client.get(`/payments/pesapal/status/${orderTrackingId}`)),
};
