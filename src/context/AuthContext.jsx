import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { type: 'platform'|'tenant', profile }
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = tokenStorage.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const payload = await authApi.me();
      setSession({ type: payload.type, role: payload.role, schoolId: payload.schoolId, sub: payload.sub });
    } catch {
      tokenStorage.clear();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const loginPlatform = async (email, password) => {
    const result = await authApi.platformLogin(email, password);
    tokenStorage.set(result.accessToken, result.refreshToken);
    setSession({ type: 'platform', role: result.profile.role, profile: result.profile });
    return result;
  };

  const loginTenant = async (identifier, password) => {
    const result = await authApi.tenantLogin(identifier, password);
    tokenStorage.set(result.accessToken, result.refreshToken);
    setSession({ type: 'tenant', role: result.profile.role, profile: result.profile });
    return result;
  };

  const logout = async () => {
    const refreshToken = tokenStorage.getRefresh();
    tokenStorage.clear();
    setSession(null);
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {}); // best-effort server-side revoke
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, loginPlatform, loginTenant, logout, refresh: bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
