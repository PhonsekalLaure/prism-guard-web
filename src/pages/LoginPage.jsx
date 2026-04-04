import { useEffect } from 'react';
import BrandPanel from '../components/login/BrandPanel';
import LoginForm from '../components/login/LoginForm';
import Notification from '../components/ui/Notification';
import useNotification from '../hooks/useNotification';
import '../styles/Login.css';

export default function LoginPage() {
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className="login-page">
        <BrandPanel />

        <div className="login-form-panel">
          <div className="login-card">
            <LoginForm onNotify={showNotification} />
          </div>
        </div>
      </div>
    </>
  );
}
