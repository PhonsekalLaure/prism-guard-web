import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VerifyEmailPage() {
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleVerification = async () => {
      // Supabase can send parameters in the hash (Implicit) or query string (PKCE)
      const hash = window.location.hash;
      const search = window.location.search;
      
      const hashParams = new URLSearchParams(hash.substring(1));
      const searchParams = new URLSearchParams(search.substring(1));
      
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      const error = hashParams.get('error') || searchParams.get('error');
      const msg = hashParams.get('message') || searchParams.get('message');
      
      // Clear the URL so we don't process it again on reload
      window.history.replaceState(null, '', window.location.pathname);

      if (error || errorDescription) {
        const displayError = errorDescription ? errorDescription.replace(/\+/g, ' ') : 'Authentication error occurred.';
        showNotification(displayError, 'error', 0);
        setMessage('Verification failed.');
        setTimeout(() => navigate('/profile', { replace: true }), 3000);
        return;
      }

      if (msg) {
        // This is usually the first link of a secure email change: 
        // "Confirmation link accepted. Please proceed to confirm link sent to the other email"
        const displayMsg = msg.replace(/\+/g, ' ');
        setMessage(displayMsg);
        showNotification(displayMsg, 'info', 0);
        // Don't redirect immediately so they can read the instruction
        return;
      }

      // For the second link, Supabase will provide an access token (or a code that gets exchanged automatically).
      // We rely on the Supabase client to automatically parse the URL and establish the session.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session) {
        // Keep our custom auth system in sync by saving the tokens
        localStorage.setItem('access_token', session.access_token);
        if (session.refresh_token) {
          localStorage.setItem('refresh_token', session.refresh_token);
        }
        
        showNotification('Email address successfully updated!', 'success');
        setMessage('Email address successfully updated! Redirecting...');
        
        // Reconcile and get fresh data
        authService.getMe(true).then(() => {
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 2000);
        });
      } else {
        // If no session and no message was found, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleVerification();
  }, [location, showNotification, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', textAlign: 'center', padding: '0 20px' }}>
      <h2>Email Verification</h2>
      <p style={{ marginTop: '1rem', color: '#64748b' }}>{message}</p>
    </div>
  );
}
