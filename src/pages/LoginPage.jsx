import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import LoginForm from '@components/login/LoginForm';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import '@styles/Auth.css';

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

      <AuthLayout>
        <div className="auth-card">
          <LoginForm onNotify={showNotification} />
        </div>
      </AuthLayout>
    </>
  );
}
