import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BrandPanel from '@components/login/BrandPanel';
import LoginForm from '@components/login/LoginForm';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import '@styles/Login.css';

export default function LoginPage() {
  const { notification, showNotification, closeNotification } = useNotification();
  const location = useLocation();

  useEffect(() => {
    async function checkExistingSession() {
      const result = await authService.getMe();
      if (result) {
        window.location.href = result.redirect;
      }
    }
    checkExistingSession();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showNotification(location.state.message, location.state.type || 'info');
    }
  }, [location.state, showNotification]);

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
