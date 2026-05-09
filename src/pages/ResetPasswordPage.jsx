import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FaArrowRight, FaEye, FaEyeSlash, FaLock,
  FaCheckCircle,
} from 'react-icons/fa';
import PasswordRequirements from '@components/auth/PasswordRequirements';
import AuthInlineNotification from '@components/auth/AuthInlineNotification';
import AuthLayout from '@/layouts/AuthLayout';
import authService from '@services/authService';
import supabase from '@services/supabaseBrowserClient';
import {
  getPasswordPolicyError,
  getPasswordStrength,
  validatePassword,
} from '@utils/passwordPolicy';
import '@styles/Auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [success, setSuccess]           = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [password, setPassword]         = useState('');

  const strength       = getPasswordStrength(password);
  const passwordPolicy = validatePassword(password);

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const watchedPassword        = watch('newPassword', '');
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
    setNotification({ message: 'Updating your password...', type: 'info' });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess(true);
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
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card-header">
          <div className={`auth-header-icon ${success ? 'success' : ''}`}>
            {success ? <FaCheckCircle /> : <FaLock />}
          </div>
          <h2>{success ? 'All Done!' : 'Set New Password'}</h2>
          <p>{success ? 'Your password has been updated' : 'Choose a strong password for your account'}</p>
        </div>

        {success ? (
          <div className="auth-success-body">
            <p className="auth-success-title">Password updated!</p>
            <p className="auth-success-sub">
              Your password has been changed successfully.
              You will be redirected to the login page in a moment.
            </p>
            <button className="auth-btn" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/login')}>
              <span>Go to Login</span>
              <FaArrowRight className="arrow" />
            </button>
          </div>
        ) : (
          <div className="auth-card-body">
            <AuthInlineNotification {...(notification || {})} />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="auth-form-group">
                <label htmlFor="auth-new-password">New Password</label>
                <div className="auth-password-wrapper">
                  <input
                    type={showNew ? 'text' : 'password'}
                    id="auth-new-password"
                    className={`auth-input ${errors.newPassword ? 'input-error' : ''}`}
                    placeholder="Enter new password"
                    {...register('newPassword', {
                      required: 'Please enter a new password',
                      validate: (value) => getPasswordPolicyError(value),
                    })}
                  />
                  <button type="button" className="auth-password-toggle"
                    onClick={() => setShowNew(v => !v)}
                    aria-label={showNew ? 'Hide password' : 'Show password'}>
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && <span className="auth-field-error">{errors.newPassword.message}</span>}
                <div className="auth-strength-bar">
                  {[1, 2, 3, 4].map((seg) => (
                    <div key={seg} className={`auth-strength-segment ${strength.score >= seg ? strength.cls : ''}`} />
                  ))}
                </div>
                <p className={`auth-strength-label ${strength.cls}`}>{strength.label}</p>
              </div>

              <PasswordRequirements
                password={password}
                passwordsMatch={password.length > 0 && watchedConfirmPassword === watchedPassword}
                variant="reset"
              />

              <div className="auth-form-group">
                <label htmlFor="auth-confirm-password">Confirm New Password</label>
                <div className="auth-password-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="auth-confirm-password"
                    className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Re-enter new password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (val) => val === watchedPassword || 'Passwords do not match',
                    })}
                  />
                  <button type="button" className="auth-password-toggle"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword.message}</span>}
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={isSubmitting || !isValid || !passwordPolicy.isValid || watchedConfirmPassword !== watchedPassword}
              >
                <span>{isSubmitting ? 'Updating...' : 'Set New Password'}</span>
                <FaArrowRight className="arrow" />
              </button>
            </form>
          </div>
        )}

        <div className="auth-card-footer">
          <p>
            2026 PRISM-Guard System<br />
            Praise Security and Investigation Agency Inc.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
