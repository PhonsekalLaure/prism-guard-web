import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBan, FaCompass, FaLock } from 'react-icons/fa';
import authService from '@services/authService';
import '@styles/components/ErrorStatusPage.css';

const STATUS_CONFIG = {
  401: {
    icon: FaLock,
    label: 'Authentication required',
    title: 'Sign in to continue',
    description: 'Your session is missing or has expired. Sign in again to access this PRISM-Guard page.',
  },
  403: {
    icon: FaBan,
    label: 'Access restricted',
    title: 'You do not have access to this page',
    description: 'Your account is active, but this route is outside your role or assigned permissions.',
  },
  404: {
    icon: FaCompass,
    label: 'Page not found',
    title: 'This page could not be found',
    description: 'The page may have moved, been removed, or the address may be incorrect.',
  },
};

function getDashboardPath(profile, preferredPath) {
  if (preferredPath) return preferredPath;
  if (profile?.role === 'client') return '/cms/dashboard';
  if (profile?.role === 'admin') return '/dashboard';
  return null;
}

function getAction(statusCode, dashboardPath) {
  if (statusCode === 401) {
    return { label: 'Sign in', path: '/login' };
  }

  if (dashboardPath) {
    return { label: 'Go to dashboard', path: dashboardPath };
  }

  return { label: 'Sign in', path: '/login' };
}

export default function ErrorStatusPage({ statusCode = 404, homePath, className = '' }) {
  const navigate = useNavigate();
  const normalizedStatus = Number(statusCode);
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG[404];
  const profile = authService.getProfile();
  const dashboardPath = getDashboardPath(profile, homePath);
  const primaryAction = getAction(normalizedStatus, dashboardPath);
  const classes = ['error-status-page', className].filter(Boolean).join(' ');

  return (
    <section className={classes} aria-labelledby="error-status-title">
      <div className="error-status-panel">
        <div className="error-status-code">{normalizedStatus}</div>
        <div className="error-status-icon" aria-hidden="true">
          {createElement(config.icon)}
        </div>
        <p className="error-status-label">{config.label}</p>
        <h1 id="error-status-title">{config.title}</h1>
        <p className="error-status-description">{config.description}</p>
        <button
          type="button"
          className="error-status-action"
          onClick={() => navigate(primaryAction.path, { replace: normalizedStatus === 401 })}
        >
          {primaryAction.label}
        </button>
      </div>
    </section>
  );
}
