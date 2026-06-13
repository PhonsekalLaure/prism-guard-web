import {
  FaExclamationTriangle, FaExclamationCircle,
  FaRegClock, FaArrowRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

const severityStyles = {
  high: {
    bgColor: '#fef2f2',
    borderColor: '#ef4444',
    iconBg: '#fecaca',
    iconColor: '#dc2626',
    icon: FaExclamationTriangle,
    timeColor: '#dc2626',
  },
  medium: {
    bgColor: '#fefce8',
    borderColor: '#eab308',
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    icon: FaExclamationCircle,
    timeColor: '#ca8a04',
  },
};

const fallbackStyle = {
  bgColor: '#f8fafc',
  borderColor: '#64748b',
  iconBg: '#e2e8f0',
  iconColor: '#475569',
  icon: FaExclamationCircle,
  timeColor: '#475569',
};

export default function IncidentFeed({ incidents, loading }) {
  const rows = incidents?.data || [];

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <h3><FaExclamationTriangle /> Critical Incident Feed (NLP Summary)</h3>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {loading ? (
          <SkeletonList count={2}>{(index) => (
            <div
              key={index}
              className="incident-card"
              style={{ background: '#f8fafc', borderLeftColor: '#e2e8f0' }}
            >
              <SkeletonBlock width={38} height={38} radius={8} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkeletonBlock height={13} width="42%" radius={4} style={{ marginBottom: '0.55rem' }} />
                <SkeletonBlock height={11} width="100%" radius={4} style={{ marginBottom: '0.35rem' }} />
                <SkeletonBlock height={11} width="78%" radius={4} style={{ marginBottom: '0.6rem' }} />
                <SkeletonBlock height={10} width="34%" radius={4} />
              </div>
            </div>
          )}</SkeletonList>
        ) : rows.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No recent incidents.</div>
        ) : rows.map((inc) => {
          const style = severityStyles[inc.severity] || fallbackStyle;
          const Icon = style.icon;
          return (
            <Link
              key={inc.id}
              to={`/incidents/${inc.id}`}
              className="incident-card"
              style={{ background: style.bgColor, borderLeftColor: style.borderColor }}
            >
              <div className="incident-icon" style={{ background: style.iconBg, color: style.iconColor }}>
                <Icon />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#1a1a1a', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  Site: {inc.site}
                </h4>
                <p className="incident-desc" style={{ color: '#4b5563' }}>{inc.summary}</p>
                <div className="incident-time" style={{ color: style.timeColor }}>
                  <FaRegClock />
                  <span>{inc.relativeTime}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link to="/incidents" className="panel-link">
        View All Incidents <FaArrowRight style={{ fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
