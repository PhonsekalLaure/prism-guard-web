import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '@services/authService';
import { hasAllPermissions } from '@utils/adminPermissions';
import FullScreenLoader from '@components/ui/FullScreenLoader';

/**
 * ProtectedRoute wraps child routes and enforces authentication, role checks,
 * and optional admin-scoped permission checks.
 */
export default function ProtectedRoute({ allowedRoles, requiredPermissions, children }) {
  const [status, setStatus] = useState('loading');
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const result = await authService.getMe();

      if (cancelled) return;

      if (!result) {
        setStatus('unauthenticated');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(result.profile.role)) {
        setRedirect(result.redirect);
        setStatus('forbidden');
        return;
      }

      if (result.must_change_password) {
        setRedirect(result.redirect);
        setStatus('forbidden');
        return;
      }

      if (requiredPermissions && !hasAllPermissions(result.profile, requiredPermissions)) {
        setRedirect(result.redirect);
        setStatus('forbidden');
        return;
      }

      setStatus('authenticated');
    }

    checkAuth();

    return () => { cancelled = true; };
  }, [allowedRoles, requiredPermissions]);

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'forbidden' && redirect) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
