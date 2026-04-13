import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';

const incidents = [
  { date: 'Feb 16, 2026', type: 'Unauthorized Access', severity: 'HIGH', severityBg: '#dc2626', severityColor: '#fff', status: 'Investigating', statusBg: '#fef9c3', statusColor: '#a16207' },
  { date: 'Feb 15, 2026', type: 'Property Damage', severity: 'MEDIUM', severityBg: '#f59e0b', severityColor: '#fff', status: 'Monitoring', statusBg: '#dbeafe', statusColor: '#1d4ed8' },
  { date: 'Feb 14, 2026', type: 'Visitor Incident', severity: 'LOW', severityBg: '#6b7280', severityColor: '#fff', status: 'Resolved', statusBg: '#dcfce7', statusColor: '#15803d' },
  { date: 'Feb 13, 2026', type: 'Suspicious Activity', severity: 'LOW', severityBg: '#6b7280', severityColor: '#fff', status: 'Resolved', statusBg: '#dcfce7', statusColor: '#15803d' },
  { date: 'Feb 12, 2026', type: 'Lost Item Recovery', severity: 'MEDIUM', severityBg: '#f59e0b', severityColor: '#fff', status: 'Resolved', statusBg: '#dcfce7', statusColor: '#15803d' },
];

const thStyle = { padding: '0.65rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 600, color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '0.85rem 1rem', fontSize: '0.85rem' };

export default function RecentIncidents() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaExclamationTriangle /> Critical Incident Feed
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Severity</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ ...tdStyle, color: '#4b5563', fontWeight: 600 }}>{inc.date}</td>
                <td style={{ ...tdStyle, fontWeight: 600, color: '#1a1a1a' }}>{inc.type}</td>
                <td style={tdStyle}>
                  <span style={{ background: inc.severityBg, color: inc.severityColor, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {inc.severity}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ background: inc.statusBg, color: inc.statusColor, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                    {inc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '0.9rem 1.2rem', borderTop: '1px solid #f0f0f0', background: '#f8f9fa', textAlign: 'center' }}>
        <Link to="/cms/incident-reports" style={{ color: '#093269', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          View All Incidents <FaArrowRight style={{ fontSize: '0.7rem' }} />
        </Link>
      </div>
    </div>
  );
}