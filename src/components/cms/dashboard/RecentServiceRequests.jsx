import { Link } from 'react-router-dom';
import { FaHeadset, FaUserPlus, FaExchangeAlt, FaDotCircle, FaArrowRight } from 'react-icons/fa';

const requests = [
  { id: 'SR-2026-048', typeIcon: <FaUserPlus style={{ color: '#3b82f6' }} />, type: 'Additional Guard', status: 'In Progress', statusBg: '#fef9c3', statusColor: '#a16207' },
  { id: 'SR-2026-047', typeIcon: <FaExchangeAlt style={{ color: '#e6b215' }} />, type: 'Guard Replacement', status: 'Open', statusBg: '#dbeafe', statusColor: '#1d4ed8' },
  { id: 'SR-2026-045', typeIcon: <FaDotCircle style={{ color: '#10b981' }} />, type: 'Schedule Change', status: 'Resolved', statusBg: '#dcfce7', statusColor: '#15803d' },
];

const thStyle = { padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '0.85rem 1rem', fontSize: '0.85rem' };

export default function RecentServiceRequests() {
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
            {requests.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 700, color: '#093269', fontSize: '0.8rem' }}>{r.id}</td>
                <td style={{ ...tdStyle, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1a1a1a' }}>
                  {r.typeIcon}{r.type}
                </td>
                <td style={tdStyle}>
                  <span style={{ background: r.statusBg, color: r.statusColor, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
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