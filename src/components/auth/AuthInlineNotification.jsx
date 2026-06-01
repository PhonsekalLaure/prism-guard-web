import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from 'react-icons/fa';

export default function AuthInlineNotification({ message, type }) {
  if (!message) return null;

  const Icon = type === 'error'
    ? FaExclamationCircle
    : type === 'success'
      ? FaCheckCircle
      : FaInfoCircle;

  return (
    <div className={`auth-notification ${type}`}>
      <Icon />
      <span>{message}</span>
    </div>
  );
}
