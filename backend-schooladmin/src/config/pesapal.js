import { env } from './env.js';

const BASE_URLS = {
  sandbox: 'https://cybqa.pesapal.com/pesapalv3',
  live: 'https://pay.pesapal.com/v3',
};

export const pesapalConfig = {
  baseUrl: BASE_URLS[env.pesapal.env] || BASE_URLS.sandbox,
  consumerKey: env.pesapal.consumerKey,
  consumerSecret: env.pesapal.consumerSecret,
  ipnUrl: env.pesapal.ipnUrl,
  callbackUrl: env.pesapal.callbackUrl,
};
