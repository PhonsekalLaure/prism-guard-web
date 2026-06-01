import BrandPanel from '@components/login/BrandPanel';

/**
 * AuthLayout — full-screen split layout used for authentication pages
 * (login, forgot-password, etc.).
 *
 * It directly includes the left decorative panel and renders its children
 * in the right content panel.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <BrandPanel />

      <div className="auth-form-panel">
        {children}
      </div>
    </div>
  );
}
