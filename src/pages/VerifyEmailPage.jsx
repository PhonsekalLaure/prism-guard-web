import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';

export default function VerifyEmailPage() {
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    
    // Check if there is an error or a token in the hash
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      const params = new URLSearchParams(hash.substring(1));
      const type = params.get('type');
      const errorDescription = params.get('error_description');
      const error = params.get('error');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      // Clear the hash so we don't process it again on reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search);

      if (error || errorDescription) {
        const msg = errorDescription 
          ? errorDescription.replace(/\+/g, ' ') 
          : 'Authentication error occurred.';
        showNotification(msg, 'error', 0);
        setTimeout(() => navigate('/profile', { replace: true }), 3000);
      } else if (accessToken) {
        // Update local session
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        if (type === 'email_change') {
          showNotification('Email address successfully updated!', 'success');
          // Reconcile and get fresh data
          authService.getMe(true).then(() => {
            setTimeout(() => {
              navigate('/profile', { replace: true });
            }, 2000);
          });
        }
      }
    } else {
      // If someone just visited /verify-email without a hash, redirect them away
      navigate('/login', { replace: true });
    }
  }, [location, showNotification, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2>Verifying your email...</h2>
      <p>Please wait while we securely confirm your new email address.</p>
    </div>
  );
}
