import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps a route element. `type` restricts to 'platform' or 'tenant'
 * sessions; `roles` (optional) further restricts to specific JWT roles
 * (e.g. ['SCHOOLADMIN_PRIMARY']). Redirects to `redirectTo` (default '/')
 * when the check fails, preserving existing navigation/URLs otherwise.
 */
export default function ProtectedRoute({ children, type, roles, redirectTo = '/' }) {
  const { session, loading } = useAuth();

  if (loading) return null; // avoid flashing a redirect before bootstrap resolves

  if (!session) return <Navigate to={redirectTo} replace />;
  if (type && session.type !== type) return <Navigate to={redirectTo} replace />;
  if (roles && !roles.includes(session.role)) return <Navigate to={redirectTo} replace />;

  return children;
}
