import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '@services/authService';

/**
 * ProtectedRoute — wraps child routes and enforces authentication + role checks.
 *
 * Props:
 *   allowedRoles — array of roles permitted to access the wrapped routes (e.g. ['admin'])
 *   children     — the child route elements to render
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated' | 'forbidden'
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

      // Check role if allowedRoles is specified
      if (allowedRoles && !allowedRoles.includes(result.profile.role)) {
        // User is auth'd but wrong role — redirect them to their correct area
        setRedirect(result.redirect);
        setStatus('forbidden');
        return;
      }

      setStatus('authenticated');
    }

    checkAuth();

    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: "'Poppins', sans-serif",
        color: '#093269',
        fontSize: '1rem',
      }}>
        Loading…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (status === 'forbidden' && redirect) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
