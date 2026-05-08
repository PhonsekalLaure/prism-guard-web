import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import PasswordRequirements from '@components/auth/PasswordRequirements';
import BrandPanel from '@components/login/BrandPanel';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import {
  getPasswordPolicyError,
  validatePassword,
} from '@utils/passwordPolicy';
import '@styles/Login.css';
import '@styles/SetPassword.css';
import '@styles/components/ChangePasswordModal.css';

// Direct Supabase client for auth operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { notification, showNotification, closeNotification } = useNotification();
  const passwordPolicy = validatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  useEffect(() => {
    // Supabase automatically handles the hash fragment and signs the user in
    // when they come from an invite or recovery link.
    const checkSession = async () => {
      let { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!sessionError) {
            session = sessionData.session;
          }
        }
      }

      if (!session && !success) {
        showNotification(
          'Invalid or expired invitation link. Please contact your administrator.',
          'error',
          0  // duration 0 = persistent (won't auto-dismiss)
        );
      }
    };
    checkSession();
  }, [showNotification, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordPolicy.isValid) {
      showNotification(getPasswordPolicyError(password), 'error');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      await authService.updatePassword({
        password,
        confirmPassword,
        clearMustChangePassword: true,
        accessToken: session?.access_token,
      });

      setSuccess(true);
      showNotification('Password set successfully! Redirecting to login...', 'success');
      // Auto-logout after setting password to force a clean login
      await supabase.auth.signOut();
      authService.clearTokens();

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.error || err.message || 'Failed to set password. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <BrandPanel />

      <div className="login-form-panel">
        <div className="login-card">
          {success ? (
            <div className="sp-success">
              <div className="sp-success-icon">
                <FaCheckCircle />
              </div>
              <h2 className="sp-success-title">Password Set!</h2>
              <p className="sp-success-desc">
                Your account is now ready. You will be redirected to the login page shortly.
              </p>
              <div className="sp-progress-bar">
                <div className="sp-progress-fill" />
              </div>
            </div>
          ) : (
            <>
              <div className="card-header">
                <h2>Setup Your Account</h2>
                <p>Create a secure password for your PrismGuard account.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-wrapper">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <span className="field-error" style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                    All password requirements must be met before submission.
                  </span>
                </div>

                <PasswordRequirements password={password} passwordsMatch={passwordsMatch} />

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !passwordPolicy.isValid || !passwordsMatch}
                  className="btn-login"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="sp-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : 'Initialize My Account'}
                </button>
              </form>

              <div className="card-footer">
                <p>
                  This link was sent to your email by a PRISM-Guard administrator.<br />
                  For issues, contact your system administrator.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
