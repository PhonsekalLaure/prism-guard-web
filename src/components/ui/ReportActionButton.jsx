import { isValidElement } from 'react';
import { FaSpinner } from 'react-icons/fa';
import '@styles/components/ReportActions.css';

function renderIcon(icon) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const Icon = icon;
  return <Icon />;
}

export default function ReportActionButton({
  label,
  loadingLabel,
  icon,
  loading = false,
  disabled = false,
  variant = 'secondary',
  className = '',
  type = 'button',
  onClick,
}) {
  return (
    <button
      className={`report-action-btn report-action-btn--${variant} ${className}`.trim()}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <FaSpinner className="report-action-btn__spinner" /> : renderIcon(icon)}
      <span>{loading ? (loadingLabel || label) : label}</span>
    </button>
  );
}
