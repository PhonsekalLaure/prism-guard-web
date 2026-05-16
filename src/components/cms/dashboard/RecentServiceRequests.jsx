import { Link } from 'react-router-dom';
import { FaHeadset, FaUserPlus, FaExchangeAlt, FaDotCircle, FaArrowRight, FaWrench } from 'react-icons/fa';

const thStyle = { padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '0.85rem 1rem', fontSize: '0.85rem' };

/** Map ticket_type string to a matching icon */
function typeIcon(type = '') {
  const t = type.toLowerCase();
  if (t.includes('additional') || t.includes('add'))   return <FaUserPlus style={{ color: '#3b82f6' }} />;
  if (t.includes('replacement') || t.includes('replace')) return <FaExchangeAlt style={{ color: '#e6b215' }} />;
  if (t.includes('schedule'))                           return <FaDotCircle style={{ color: '#10b981' }} />;
  return <FaWrench style={{ color: '#6b7280' }} />;
}

/** Map status to badge colours */
function statusStyle(status = '') {
  switch (status.toLowerCase()) {
    case 'in_progress':
    case 'in progress': return { bg: '#fef9c3', color: '#a16207' };
    case 'open':        return { bg: '#dbeafe', color: '#1d4ed8' };
    case 'resolved':
    case 'closed':      return { bg: '#dcfce7', color: '#15803d' };
    default:            return { bg: '#f3f4f6', color: '#374151' };
  }
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
      {[1, 2, 3].map((i) => (
        <td key={i} style={tdStyle}>
          <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  );
}

export default function RecentServiceRequests({ requests, loading }) {
  const rows = requests || [];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaHeadset /> Recent Service Requests
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              : rows.length === 0
                ? (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#7f8c8d' }}>No recent service requests</td>
                  </tr>
                )
                : rows.map((r, i) => {
                  const badge = statusStyle(r.status);
                  return (
                    <tr key={r.id ?? i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700, color: '#093269', fontSize: '0.8rem' }}>
                        #{String(r.id).substring(0, 8).toUpperCase()}
                      </td>
                      <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1a1a1a' }}>
                        {typeIcon(r.type)}{r.type}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ background: badge.bg, color: badge.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      <div style={{ padding: '0.9rem 1.2rem', borderTop: '1px solid #f0f0f0', background: '#f8f9fa', textAlign: 'center' }}>
        <Link to="/cms/service-requests" style={{ color: '#093269', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          View All Requests <FaArrowRight style={{ fontSize: '0.7rem' }} />
        </Link>
      </div>
    </div>
  );
}