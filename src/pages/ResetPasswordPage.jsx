import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FaArrowRight, FaEye, FaEyeSlash, FaLock,
  FaCheckCircle,
  FaExclamationCircle, FaInfoCircle,
} from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import PasswordRequirements from '@components/auth/PasswordRequirements';
import BrandPanel from '@components/login/BrandPanel';
import authService from '@services/authService';
import {
  getPasswordPolicyError,
  getPasswordStrength,
  validatePassword,
} from '@utils/passwordPolicy';
import '@styles/ResetPassword.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// ─── Password strength ─────────────────────────────────────────

// ─── Inline notification ───────────────────────────────────────

function Notification({ message, type }) {
  if (!message) return null;
  const Icon = type === 'error'   ? FaExclamationCircle
             : type === 'success' ? FaCheckCircle
             : FaInfoCircle;
  return (
    <div className={`reset-notification ${type}`}>
      <Icon /><span>{message}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [success, setSuccess]           = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [password, setPassword]         = useState('');

  const strength = getPasswordStrength(password);
  const passwordPolicy = validatePassword(password);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const watchedPassword = watch('newPassword', '');
  const watchedConfirmPassword = watch('confirmPassword', '');

  useEffect(() => { setPassword(watchedPassword); }, [watchedPassword]);

  useEffect(() => {
    let cancelled = false;

    const showExpiredLinkMessage = () => {
      navigate('/login', {
        replace: true,
        state: {
          message: 'Your password reset link is invalid or expired. Please request a new one.',
          type: 'error',
        },
      });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true);
      }
    });

    const checkRecoverySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (cancelled) return;

      if (session) {
        setSessionReady(true);
        return;
      }

      window.setTimeout(async () => {
        const { data: { session: delayedSession } } = await supabase.auth.getSession();
        if (cancelled) return;

        if (delayedSession) {
          setSessionReady(true);
        } else {
          showExpiredLinkMessage();
        }
      }, 300);
    };

    checkRecoverySession();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    if (!validatePassword(newPassword).isValid) {
      setNotification({ message: getPasswordPolicyError(newPassword), type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setNotification({ message: 'Updating your password…', type: 'info' });

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setSuccess(true);
      // Sign out so the user begins a clean session with their new password
      await supabase.auth.signOut();
      authService.clearTokens();
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setNotification({
        message: err?.response?.data?.error || err.message || 'Failed to update password. The link may have expired.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sessionReady && !success) return null;

  return (
    <div className="login-page">
      <BrandPanel />

      <div className="login-form-panel">
        <div className="reset-card">

          {/* Header */}
          <div className="reset-card-header">
            <div className={`reset-header-icon ${success ? 'success' : ''}`}>
              {success ? <FaCheckCircle /> : <FaLock />}
            </div>
            <h2>{success ? 'All Done!' : 'Set New Password'}</h2>
            <p>{success ? 'Your password has been updated' : 'Choose a strong password for your account'}</p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="reset-success-body">
              <p className="reset-success-title">Password updated!</p>
              <p className="reset-success-sub">
                Your password has been changed successfully.
                You'll be redirected to the login page in a moment.
              </p>
              <button className="reset-btn" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/login')}>
                <span>Go to Login</span>
                <FaArrowRight className="arrow" />
              </button>
            </div>
          ) : (
            <div className="reset-card-body">
              <Notification {...(notification || {})} />

              <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* New password */}
                <div className="reset-form-group">
                  <label htmlFor="reset-new-password">New Password</label>
                  <div className="reset-password-wrapper">
                    <input
                      type={showNew ? 'text' : 'password'}
                      id="reset-new-password"
                      className={`reset-input ${errors.newPassword ? 'input-error' : ''}`}
                      placeholder="Enter new password"
                      {...register('newPassword', {
                        required: 'Please enter a new password',
                        validate: (value) => getPasswordPolicyError(value),
                      })}
                    />
                    <button type="button" className="reset-password-toggle"
                      onClick={() => setShowNew(v => !v)}
                      aria-label={showNew ? 'Hide password' : 'Show password'}>
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="reset-field-error">{errors.newPassword.message}</span>}

                  {password && (
                    <>
                      <div className="reset-strength-bar">
                        {[1, 2, 3, 4].map((seg) => (
                          <div key={seg} className={`reset-strength-segment ${strength.score >= seg ? strength.cls : ''}`} />
                        ))}
                      </div>
                      <p className={`reset-strength-label ${strength.cls}`}>{strength.label}</p>
                    </>
                  )}
                </div>

                {/* Requirements checklist */}
                {password && (
                  <PasswordRequirements
                    password={password}
                    passwordsMatch={watchedConfirmPassword === watchedPassword}
                    variant="reset"
                  />
                )}

                {/* Confirm password */}
                <div className="reset-form-group">
                  <label htmlFor="reset-confirm-password">Confirm New Password</label>
                  <div className="reset-password-wrapper">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="reset-confirm-password"
                      className={`reset-input ${errors.confirmPassword ? 'input-error' : ''}`}
                      placeholder="Re-enter new password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: (val) => val === watchedPassword || 'Passwords do not match',
                      })}
                    />
                    <button type="button" className="reset-password-toggle"
                      onClick={() => setShowConfirm(v => !v)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="reset-field-error">{errors.confirmPassword.message}</span>}
                </div>

                <button
                  type="submit"
                  className="reset-btn"
                  disabled={isSubmitting || !isValid || !passwordPolicy.isValid || watchedConfirmPassword !== watchedPassword}
                >
                  <span>{isSubmitting ? 'Updating…' : 'Set New Password'}</span>
                  <FaArrowRight className="arrow" />
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="reset-card-footer">
            <p>
              © 2026 PRISM-Guard System<br />
              Praise Security and Investigation Agency Inc.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
