import { useState, useCallback } from 'react';

export default function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, closeNotification };
}
