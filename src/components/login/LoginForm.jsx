import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft,
  FaEnvelope, FaCheckCircle, FaExclamationCircle, FaInfoCircle,
} from 'react-icons/fa';
import authService from '@services/authService';

// ─── Inline notification (used in forgot/sent views) ──────────
function InlineNotification({ message, type }) {
  if (!message) return null;
  const Icon = type === 'error' ? FaExclamationCircle
             : type === 'success' ? FaCheckCircle
             : FaInfoCircle;
  return (
    <div className={`lf-notification ${type}`}>
      <Icon />
      <span>{message}</span>
    </div>
  );
}

// ─── View 1: Login ────────────────────────────────────────────
function LoginView({ onNotify, onForgot }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    onNotify?.('Logging in...', 'info');
    try {
      const result = await authService.login(data.email.trim(), data.password, data.rememberMe);
      onNotify?.('Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = result.redirect; }, 1000);
    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.error;
      if (status === 401) {
        onNotify?.(message || 'Invalid email or password', 'error');
      } else if (status === 403) {
        onNotify?.(message || 'You do not have access to this portal', 'error');
      } else {
        onNotify?.('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card-header">
        <h2>Login</h2>
        <p>Portal</p>
      </div>

      <form id="loginForm" onSubmit={handleSubmit(onSubmit, () => onNotify?.('Please fix the errors below', 'error'))} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            className={errors.email ? 'input-error' : ''}
            {...register('email', {
              required: 'Please fill in your email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
            })}
          />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              className={errors.password ? 'input-error' : ''}
              {...register('password', {
                required: 'Please fill in your password',
              })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </div>

        <div className="form-options">
          <label className="remember-label">
            {/* rememberMe → localStorage; unchecked → sessionStorage (clears on tab close) */}
            <input type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <button type="button" className="forgot-link" onClick={onForgot}>
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="btn-login" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Logging In…' : 'Log In'}</span>
          <FaArrowRight className="arrow" />
        </button>
      </form>

      <div className="card-footer">
        <p>
          © 2026 PRISM-Guard System<br />
          Praise Security and Investigation Agency Inc.
        </p>
      </div>
    </>
  );
}

// ─── View 2: Forgot password ───────────────────────────────────
function ForgotView({ onBack, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' });

  const onSubmit = async ({ email }) => {
    const normalizedEmail = email.trim();
    setIsSubmitting(true);
    setNotification({ message: 'Sending reset link…', type: 'info' });
    try {
      await authService.forgotPassword(normalizedEmail);
      onSuccess(normalizedEmail);
    } catch (err) {
      setNotification({
        message: err.response?.data?.error || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card-header">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>
      </div>

      <div className="lf-forgot-body">
        <InlineNotification {...(notification || {})} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="forgot-email">Email Address</label>
            <input
              type="email"
              id="forgot-email"
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your account email"
              {...register('email', {
                required: 'Please enter your email address',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
              })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <button type="submit" className="btn-login" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Sending…' : 'Send Reset Link'}</span>
            <FaArrowRight className="arrow" />
          </button>
        </form>

        <button type="button" className="lf-back-link" onClick={onBack}>
          <FaArrowLeft /> Back to Login
        </button>
      </div>

      <div className="card-footer">
        <p>
          © 2026 PRISM-Guard System<br />
          Praise Security and Investigation Agency Inc.
        </p>
      </div>
    </>
  );
}

// ─── View 3: Email sent confirmation ──────────────────────────
function EmailSentView({ email, onBack }) {
  return (
    <>
      <div className="card-header">
        <h2>Check Your Inbox</h2>
        <p>A reset link has been sent to your email</p>
      </div>

      <div className="lf-forgot-body">
        <div className="lf-sent-box">
          <div className="lf-sent-icon"><FaEnvelope /></div>
          <p className="lf-sent-email">{email}</p>
          <p className="lf-sent-desc">
            Click the link in the email to reset your password.
            The link expires in <strong>60 minutes</strong>.
          </p>
          <p className="lf-sent-hint">
            Didn't receive it? Check your spam folder or try a different email.
          </p>
        </div>

        <button type="button" className="lf-back-link" onClick={onBack}>
          <FaArrowLeft /> Back to Login
        </button>
      </div>

      <div className="card-footer">
        <p>
          © 2026 PRISM-Guard System<br />
          Praise Security and Investigation Agency Inc.
        </p>
      </div>
    </>
  );
}

// ─── Root component — owns view state ─────────────────────────
export default function LoginForm({ onNotify }) {
  const [view, setView]           = useState('login'); // 'login' | 'forgot' | 'sent'
  const [sentEmail, setSentEmail] = useState('');

  return (
    <>
      {view === 'login' && (
        <LoginView
          onNotify={onNotify}
          onForgot={() => setView('forgot')}
        />
      )}
      {view === 'forgot' && (
        <ForgotView
          onBack={() => setView('login')}
          onSuccess={(email) => { setSentEmail(email); setView('sent'); }}
        />
      )}
      {view === 'sent' && (
        <EmailSentView
          email={sentEmail}
          onBack={() => setView('login')}
        />
      )}
    </>
  );
}
