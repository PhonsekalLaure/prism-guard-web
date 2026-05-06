import { Link } from 'react-router-dom';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';

/** Map contract status string to badge colours */
function contractBadge(status = '') {
  switch (status.toLowerCase()) {
    case 'active':       return { bg: '#dcfce7', color: '#15803d' };
    case 'upcoming':     return { bg: '#dbeafe', color: '#1d4ed8' };
    case 'expiring soon':return { bg: '#fef9c3', color: '#a16207' };
    case 'expired':      return { bg: '#fef2f2', color: '#dc2626' };
    default:             return { bg: '#f3f4f6', color: '#374151' };
  }
}

const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f0f0f0' };

function SkeletonRow() {
  return (
    <div style={{ ...rowStyle }}>
      <div style={{ height: '12px', width: '80px', background: '#f0f0f0', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '12px', width: '100px', background: '#f0f0f0', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

export default function ContractOverview({ overview, loading }) {
  const badge = contractBadge(overview?.contract_status || '');

  const rows = [
    { label: 'Contract Status', badge: overview?.contract_status },
    { label: 'Start Date', value: overview?.contract_start_date_formatted || '—' },
    { label: 'End Date', value: overview?.contract_end_date_formatted || '—' },
    { label: 'Guards Deployed', value: overview?.guards_deployed ?? '—', bold: true, color: '#093269' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaClipboardList /> Contract Overview
        </h3>
      </div>

      <div style={{ padding: '0.5rem 1.2rem' }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          : rows.map((r, i) => (
            <div key={i} style={{ ...rowStyle, borderBottom: i < rows.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <p style={{ fontSize: '0.78rem', color: '#7f8c8d', margin: 0 }}>{r.label}</p>
              {r.badge ? (
                <span style={{ background: badge.bg, color: badge.color, padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700 }}>
                  {r.badge}
                </span>
              ) : (
                <p style={{ fontSize: '0.82rem', fontWeight: r.bold ? 700 : 600, color: r.color || '#1a1a1a', margin: 0 }}>
                  {r.value}
                </p>
              )}
            </div>
          ))
        }
      </div>

      <div style={{ padding: '0.9rem 1.2rem', borderTop: '1px solid #f0f0f0', background: '#f8f9fa', textAlign: 'center' }}>
        <Link to="/cms/profile" style={{ color: '#093269', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          View Full Contract <FaArrowRight style={{ fontSize: '0.7rem' }} />
        </Link>
      </div>
    </div>
  );
}