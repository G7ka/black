import { client, unwrap } from './client';

export const authApi = {
  platformLogin: (email, password) =>
    unwrap(client.post('/auth/platform/login', { email, password })),

  tenantLogin: (identifier, password) =>
    unwrap(client.post('/auth/tenant/login', { identifier, password })),

  refresh: (refreshToken) => unwrap(client.post('/auth/refresh', { refreshToken })),

  logout: (refreshToken) => unwrap(client.post('/auth/logout', { refreshToken })),

  me: () => unwrap(client.get('/auth/me')),

  forgotPasswordRequest: (email, audience) =>
    unwrap(client.post('/auth/forgot-password/request', { email, audience })),

  forgotPasswordVerify: (email, audience, code) =>
    unwrap(client.post('/auth/forgot-password/verify', { email, audience, code })),

  forgotPasswordReset: (email, audience, code, newPassword) =>
    unwrap(client.post('/auth/forgot-password/reset', { email, audience, code, newPassword })),
};
