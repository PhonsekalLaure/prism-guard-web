import { useState, useEffect, useCallback } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';

const iconMap = {
  success: FaCheckCircle,
  error: FaExclamationCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
};

const bgMap = {
  success: 'bg-[#27ae60]',
  error: 'bg-[#e74c3c]',
  warning: 'bg-[#f39c12]',
  info: 'bg-[#3498db]',
};

export default function Notification({ message, type = 'info', onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!message) return null;

  const Icon = iconMap[type] || FaInfoCircle;
  const bgClass = bgMap[type] || bgMap.info;

  return (
    <div
      className={`
        fixed top-5 right-5 z-[9999] flex items-center gap-3
        px-5 py-4 rounded-lg text-white text-sm font-medium
        shadow-[0_5px_20px_rgba(0,0,0,0.2)]
        ${bgClass}
        ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
      `}
    >
      <Icon className="text-lg shrink-0" />
      <span>{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <FaTimes />
      </button>
    </div>
  );
}
