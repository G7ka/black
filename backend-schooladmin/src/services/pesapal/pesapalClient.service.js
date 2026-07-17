import { pesapalConfig } from '../../config/pesapal.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * Thin wrapper around Pesapal API 3.0. Every method here corresponds to
 * exactly one documented endpoint — no invented behavior. See
 * docs/PESAPAL_INTEGRATION.md for the source doc this was built against.
 */

let cachedToken = null; // { token, expiresAt: epoch ms }

async function pesapalFetch(path, { method = 'GET', body, token, query } = {}) {
  const url = new URL(`${pesapalConfig.baseUrl}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw ApiError.internal(`Pesapal request failed (network): ${networkErr.message}`);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw ApiError.internal(`Pesapal returned a non-JSON response (HTTP ${res.status})`);
  }

  // Pesapal's documented error shape: { error: { type, code, message } }
  if (json.error && (typeof json.error === 'object' ? json.error.code || json.error.message : json.error)) {
    const err = json.error;
    const message = typeof err === 'object' ? err.message || err.code || 'Pesapal error' : String(err);
    throw ApiError.badRequest(`Pesapal: ${message}`, err);
  }

  return json;
}

async function getAccessToken() {
  const now = Date.now();
  // Token is valid ~5 minutes per the doc — refresh with a 30s safety buffer.
  if (cachedToken && cachedToken.expiresAt - 30_000 > now) {
    return cachedToken.token;
  }

  const json = await pesapalFetch('/api/Auth/RequestToken', {
    method: 'POST',
    body: {
      consumer_key: pesapalConfig.consumerKey,
      consumer_secret: pesapalConfig.consumerSecret,
    },
  });

  if (!json.token) {
    throw ApiError.internal('Pesapal did not return an access token');
  }

  cachedToken = { token: json.token, expiresAt: new Date(json.expiryDate).getTime() };
  return json.token;
}

export const pesapalClient = {
  async registerIpn({ url, notificationType = 'GET' }) {
    const token = await getAccessToken();
    return pesapalFetch('/api/URLSetup/RegisterIPN', {
      method: 'POST',
      token,
      body: { url, ipn_notification_type: notificationType },
    });
  },

  async getIpnList() {
    const token = await getAccessToken();
    return pesapalFetch('/api/URLSetup/GetIpnList', { token });
  },

  /**
   * payload shape exactly per SubmitOrderRequest docs:
   * { id, currency, amount, description, callback_url, redirect_mode?,
   *   cancellation_url?, notification_id, branch?, billing_address,
   *   account_number?, subscription_details? }
   */
  async submitOrderRequest(payload) {
    const token = await getAccessToken();
    return pesapalFetch('/api/Transactions/SubmitOrderRequest', {
      method: 'POST',
      token,
      body: payload,
    });
  },

  async getTransactionStatus(orderTrackingId) {
    const token = await getAccessToken();
    return pesapalFetch('/api/Transactions/GetTransactionStatus', {
      token,
      query: { orderTrackingId },
    });
  },

  async refundRequest({ confirmationCode, amount, username, remarks }) {
    const token = await getAccessToken();
    return pesapalFetch('/api/Transactions/RefundRequest', {
      method: 'POST',
      token,
      body: {
        confirmation_code: confirmationCode,
        amount: String(amount),
        username,
        remarks,
      },
    });
  },

  async cancelOrder(orderTrackingId) {
    const token = await getAccessToken();
    return pesapalFetch('/api/Transactions/CancelOrder', {
      method: 'POST',
      token,
      body: { order_tracking_id: orderTrackingId },
    });
  },
};
