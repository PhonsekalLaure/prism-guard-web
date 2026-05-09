import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@services/authService';
import supabase from '@services/supabaseBrowserClient';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const getProfileRoute = async () => {
      const authData = await authService.getMe(true);
      if (!authData?.profile) return '/login';
      return authData.profile.role === 'client' ? '/cms/profile' : '/profile';
    };

    const handleVerification = async () => {
      // Supabase can send parameters in the hash (Implicit) or query string (PKCE)
      const hash = window.location.hash;
      const search = window.location.search;
      
      const hashParams = new URLSearchParams(hash.substring(1));
      const searchParams = new URLSearchParams(search.substring(1));
      
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      const error = hashParams.get('error') || searchParams.get('error');
      const msg = hashParams.get('message') || searchParams.get('message');
      const code = searchParams.get('code');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (error || errorDescription) {
        window.history.replaceState(null, '', window.location.pathname);
        const displayError = errorDescription ? errorDescription.replace(/\+/g, ' ') : 'Authentication error occurred.';
        setMessage(displayError);
        const profileRoute = await getProfileRoute();
        setTimeout(() => navigate(profileRoute, { replace: true }), 3000);
        return;
      }

      if (msg) {
        window.history.replaceState(null, '', window.location.pathname);
        // This is usually the first link of a secure email change: 
        // "Confirmation link accepted. Please proceed to confirm link sent to the other email"
        const displayMsg = msg.replace(/\+/g, ' ');
        setMessage(displayMsg);
        // Don't redirect immediately so they can read the instruction
        return;
      }

      let session = null;

      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setMessage(exchangeError.message || 'Email verification failed.');
          window.history.replaceState(null, '', window.location.pathname);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }
        session = data.session;
      } else if (accessToken && refreshToken) {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setMessage(sessionError.message || 'Email verification failed.');
          window.history.replaceState(null, '', window.location.pathname);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }
        session = data.session;
      } else {
        const { data } = await supabase.auth.getSession();
        session = data.session;
      }

      window.history.replaceState(null, '', window.location.pathname);
      
      if (session) {
        // Keep our custom auth system in sync by saving the tokens
        localStorage.setItem('access_token', session.access_token);
        if (session.refresh_token) {
          localStorage.setItem('refresh_token', session.refresh_token);
        }
        
        setMessage('Email address successfully updated! Redirecting...');
        
        // Reconcile and get fresh data
        const profileRoute = await getProfileRoute();
        setTimeout(() => {
          navigate(profileRoute, { replace: true });
        }, 2000);
      } else {
        // If no session and no message was found, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleVerification();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', textAlign: 'center', padding: '0 20px' }}>
      <h2>Email Verification</h2>
      <p style={{ marginTop: '1rem', color: '#64748b' }}>{message}</p>
    </div>
  );
}
