import { Link } from 'react-router-dom';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';

const rows = [
  { label: 'Contract ID', value: 'CTR-2024-001', bold: true, color: '#093269' },
  { label: 'Status', badge: { text: 'Active', bg: '#dcfce7', color: '#15803d' } },
  { label: 'Start Date', value: 'Jan 15, 2024' },
  { label: 'End Date', value: 'Dec 31, 2026' },
  { label: 'Guards Deployed', value: '24' },
];

const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f0f0f0' };

export default function ContractOverview() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClipboardList /> Contract Overview
        </h3>
      </div>

      <div style={{ padding: '0.5rem 1.2rem' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ ...rowStyle, borderBottom: i < rows.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <p style={{ fontSize: '0.78rem', color: '#7f8c8d', margin: 0 }}>{r.label}</p>
            {r.badge ? (
              <span style={{ background: r.badge.bg, color: r.badge.color, padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700 }}>
                {r.badge.text}
              </span>
            ) : (
              <p style={{ fontSize: '0.82rem', fontWeight: r.bold ? 700 : 600, color: r.color || '#1a1a1a', margin: 0 }}>{r.value}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '0.9rem 1.2rem', borderTop: '1px solid #f0f0f0', background: '#f8f9fa', textAlign: 'center' }}>
        <Link to="/cms/profile" style={{ color: '#093269', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          View Full Contract <FaArrowRight style={{ fontSize: '0.7rem' }} />
        </Link>
      </div>
    </div>
  );
}