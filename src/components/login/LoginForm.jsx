import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

export default function LoginForm({ onNotify }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    onNotify?.('Logging in...', 'info');

    // TODO: Replace with actual auth
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      if (data.rememberMe) localStorage.setItem('rememberDevice', 'true');

      onNotify?.('Login successful! Redirecting...', 'success');
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
      setIsSubmitting(false);
    }, 1500);
  };

  const onError = () => {
    onNotify?.('Please fix the errors below', 'error');
  };

  return (
    <>
      {/* Header */}
      <div className="card-header">
        <h2>Login</h2>
        <p>Portal</p>
      </div>

      {/* Form */}
      <form id="loginForm" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            className={errors.email ? 'input-error' : ''}
            {...register('email', {
              required: 'Please fill in your email',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
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
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                  message: 'Password must contain at least one special character',
                },
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
            <input type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <a href="#" className="forgot-link">Forgot Password?</a>
        </div>

        <button type="submit" className="btn-login" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Logging In…' : 'Log In'}</span>
          <FaArrowRight className="arrow" />
        </button>
      </form>

      {/* Footer */}
      <div className="card-footer">
        <p>
          © 2026 PRISM-Guard System
          <br />
          Praise Security and Investigation Agency Inc.
        </p>
      </div>
    </>
  );
}
