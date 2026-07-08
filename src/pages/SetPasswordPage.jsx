import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight, FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaShieldAlt, FaFileContract, FaCheck, FaChevronDown,
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
import {
  REQUIRED_SETUP_POLICIES,
  buildAcceptedPolicies,
  hasAcceptedAllRequiredPolicies,
} from '@utils/policyAcceptance';
import '@styles/Auth.css';

function getStoredSessionTokens() {
  const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  return { accessToken, refreshToken };
}

export default function SetPasswordPage() {
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess]           = useState(false);
  const [setupRole, setSetupRole]       = useState(null);
  const [notification, setNotification] = useState(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState({});
  const [policyOpen, setPolicyOpen]             = useState(false);
  const [showReqPopover, setShowReqPopover]     = useState(false);
  const navigate = useNavigate();

  const strength         = getPasswordStrength(password);
  const passwordPolicy   = validatePassword(password);
  const passwordsMatch   = password.length > 0 && password === confirmPassword;
  const policiesAccepted = hasAcceptedAllRequiredPolicies(acceptedPolicies);
  const isEmployeeSetup  = setupRole === 'employee';

  useEffect(() => {
    // Supabase automatically handles the hash fragment and signs the user in
    // when they come from an invite or recovery link.
    const checkSession = async () => {
      let { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        const { accessToken, refreshToken } = getStoredSessionTokens();

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token:  accessToken,
            refresh_token: refreshToken,
          });
          if (!sessionError) session = sessionData.session;
        }
      }

      if (!session && !success) {
        setNotification({
          message: 'Invalid or expired invitation link. Please contact your administrator.',
          type: 'error',
        });
      }
    };
    checkSession();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordPolicy.isValid) {
      setNotification({ message: getPasswordPolicyError(password), type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (!policiesAccepted) {
      setNotification({ message: 'Please accept the Data Privacy Notice and Terms and Conditions before continuing.', type: 'error' });
      setPolicyOpen(true);
      return;
    }

    setIsSubmitting(true);
    setNotification({ message: 'Setting up your account...', type: 'info' });

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const result = await authService.updatePassword({
        password,
        confirmPassword,
        clearMustChangePassword: true,
        acceptedPolicies: buildAcceptedPolicies(acceptedPolicies),
        accessToken: session?.access_token,
      });

      setSetupRole(result?.role || null);
      setSuccess(true);
      // Auto-logout after setting password to force a clean login.
      await supabase.auth.signOut();
      authService.clearTokens();
      if (result?.role !== 'employee') {
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error(err);
      setNotification({
        message: err?.response?.data?.error || err.message || 'Failed to set password. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">

        {/* Header */}
        <div className="auth-card-header">
          <div className={`auth-header-icon ${success ? 'success' : ''}`}>
            {success ? <FaCheckCircle /> : <FaLock />}
          </div>
          <h2>{success ? 'All Done!' : 'Setup Your Account'}</h2>
          <p>{success ? 'Your password has been set' : 'Create a secure password for your PrismGuard account.'}</p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="auth-success-body">
            <p className="auth-success-title">Password Set!</p>
            <p className="auth-success-sub">
              {isEmployeeSetup
                ? 'Your account is now ready. You can now sign in from the PrismGuard mobile app.'
                : "Your account is now ready. You'll be redirected to the login page shortly."}
            </p>
            {!isEmployeeSetup && (
              <>
                <div className="auth-progress-bar">
                  <div className="auth-progress-fill" />
                </div>
                <button className="auth-btn" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/login')}>
                  <span>Go to Login</span>
                  <FaArrowRight className="arrow" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="auth-card-body">
            <AuthInlineNotification {...(notification || {})} />

            <form onSubmit={handleSubmit} noValidate>

              {/* New password + floating requirements popover */}
              <div className="auth-form-group auth-pw-popover-host">
                <label htmlFor="new-password">New Password</label>
                <div className="auth-password-wrapper">
                  <input
                    className="auth-input"
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowReqPopover(true)}
                    onBlur={() => {
                      // keep open if still invalid so user can see what's missing
                      if (passwordPolicy.isValid) setShowReqPopover(false);
                    }}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Floating popover */}
                {showReqPopover && !passwordPolicy.isValid && (
                  <div className="auth-req-popover" role="status" aria-live="polite">
                    {/* Compact strength bar inside popover */}
                    <div className="auth-req-popover-strength">
                      <div className="auth-strength-bar" style={{ marginTop: 0 }}>
                        {[1, 2, 3, 4].map((seg) => (
                          <div key={seg} className={`auth-strength-segment ${strength.score >= seg ? strength.cls : ''}`} />
                        ))}
                      </div>
                      <span className={`auth-strength-label ${strength.cls}`} style={{ marginTop: 0 }}>
                        {strength.label}
                      </span>
                    </div>
                    <PasswordRequirements
                      password={password}
                      passwordsMatch={passwordsMatch}
                      variant="reset"
                    />
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="auth-form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <div className="auth-password-wrapper">
                  <input
                    className="auth-input"
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <fieldset className="auth-policy-box">
                <legend>Privacy and Terms Acknowledgement</legend>

                {/* Clickable accordion header */}
                <button
                  type="button"
                  className={`auth-policy-header auth-policy-toggle${policiesAccepted ? ' all-accepted' : ''}`}
                  onClick={() => setPolicyOpen((o) => !o)}
                  aria-expanded={policyOpen}
                >
                  <div className="auth-policy-header-icon">
                    <FaShieldAlt />
                  </div>
                  <div className="auth-policy-header-text">
                    <h4>Privacy &amp; Terms Acknowledgement</h4>
                    <p>
                      {policiesAccepted
                        ? 'All policies accepted ✓'
                        : `${Object.values(acceptedPolicies).filter(Boolean).length} of ${REQUIRED_SETUP_POLICIES.length} accepted — click to review`}
                    </p>
                  </div>
                  <FaChevronDown className={`auth-policy-chevron${policyOpen ? ' open' : ''}`} />
                </button>

                {/* Collapsible items */}
                <div className={`auth-policy-items${policyOpen ? ' open' : ''}`}>
                  {REQUIRED_SETUP_POLICIES.map((policy) => {
                    const isAccepted = acceptedPolicies[policy.policyKey] === true;
                    const PolicyIcon = policy.policyKey === 'privacy_notice' ? FaShieldAlt : FaFileContract;
                    return (
                      <label
                        className={`auth-policy-option${isAccepted ? ' accepted' : ''}`}
                        key={policy.policyKey}
                      >
                        {/* Hidden native checkbox */}
                        <input
                          type="checkbox"
                          checked={isAccepted}
                          onChange={(e) => setAcceptedPolicies((current) => ({
                            ...current,
                            [policy.policyKey]: e.target.checked,
                          }))}
                        />

                        {/* Custom animated checkbox */}
                        <span className="auth-policy-custom-check" aria-hidden="true">
                          {isAccepted && <FaCheck />}
                        </span>

                        {/* Icon badge */}
                        <span className="auth-policy-icon" aria-hidden="true">
                          <PolicyIcon />
                        </span>

                        {/* Text */}
                        <span className="auth-policy-option-text">
                          <span className="auth-policy-option-title">
                            {policy.label}&nbsp;<span style={{ opacity: 0.55, fontWeight: 500 }}>{policy.policyVersion.toUpperCase()}</span>
                          </span>
                          <span className="auth-policy-option-desc">{policy.description}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="submit"
                className="auth-btn"
                disabled={isSubmitting || !passwordPolicy.isValid || !passwordsMatch || !policiesAccepted}
              >
                {isSubmitting ? (
                  <>
                    <svg className="auth-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                      <path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up...
                  </>
                ) : (
                  <>
                    <span>Initialize My Account</span>
                    <FaArrowRight className="arrow" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="auth-card-footer">
          <p>
            This link was sent to your email by a PRISM-Guard administrator.<br />
            For issues, contact your system administrator.
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}