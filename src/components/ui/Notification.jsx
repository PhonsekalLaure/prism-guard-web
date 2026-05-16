import { useState, useEffect, useCallback } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';
import '@styles/components/Notification.css';

const iconMap = {
  success: FaCheckCircle,
  error:   FaExclamationCircle,
  warning: FaExclamationTriangle,
  info:    FaInfoCircle,
};

export default function Notification({ message, type = 'info', onClose, duration = 4000 }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!message) return null;

  const Icon = iconMap[type] || iconMap.info;
  const typeClass = `notif-${type}`;

  return (
    <div className={`notif ${typeClass} ${isExiting ? 'notif-exit' : 'notif-enter'}`}>
      <Icon className="notif-icon" />
      <span className="notif-message">{message}</span>
      <button
        className="notif-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <FaTimes />
      </button>
    </div>
  );
}
