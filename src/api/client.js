import axios from 'axios';

// Vite env var — set VITE_API_BASE_URL in .env (e.g. http://localhost:4000/api/v1)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

export const client = axios.create({ baseURL });

const TOKEN_KEY = 'edumanage.accessToken';
const REFRESH_KEY = 'edumanage.refreshToken';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// Tenant requests need X-Tenant-Subdomain since the dev/API host isn't a
// real subdomain (see utils/tenant.js — same resolution logic).
import { getSubdomain } from '../utils/tenant';

client.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const subdomain = getSubdomain();
  if (subdomain) config.headers['X-Tenant-Subdomain'] = subdomain;

  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  tokenStorage.set(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
}

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Never retry the refresh call itself or already-retried requests.
    if (status === 401 && !original._retry && !original.url.includes('/auth/refresh')) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch (refreshError) {
        refreshPromise = null;
        tokenStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Every backend response is { success, message, data, details? }.
// Unwrap here so callers just get `data`, and throw a normalized Error
// with the backend's message so components can display it directly.
export async function unwrap(promise) {
  try {
    const res = await promise;
    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Request failed';
    const err = new Error(message);
    err.details = error.response?.data?.details;
    err.status = error.response?.status;
    throw err;
  }
}
