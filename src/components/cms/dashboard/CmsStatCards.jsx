import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHeadset, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';

function formatCurrency(amount) {
  if (amount == null) return '—';
  return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CARD_CONFIGS = [
  {
    key: 'deployed_guards',
    label: 'Deployed Guards',
    border: '#093269',
    iconBg: 'rgba(9,50,105,0.1)',
    iconColor: '#093269',
    icon: FaUsers,
    to: '/cms/deployed-guards',
    format: (v) => v ?? '—',
    sub: null,
  },
  {
    key: 'pending_requests',
    label: 'Pending Requests',
    border: '#e6b215',
    iconBg: 'rgba(230,178,21,0.1)',
    iconColor: '#e6b215',
    icon: FaHeadset,
    to: '/cms/service-requests',
    format: (v) => v ?? '—',
    sub: null,
  },
  {
    key: 'today_incidents',
    label: 'Incident Reports',
    border: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
    iconColor: '#ef4444',
    icon: FaExclamationTriangle,
    to: '/cms/incident-reports',
    format: (v) => v ?? '—',
    sub: "Today's count",
  },
  {
    key: 'outstanding_payments',
    label: 'Outstanding Payments',
    border: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10b981',
    icon: FaCreditCard,
    to: '/cms/billing',
    format: (v) => formatCurrency(v),
    sub: null,
  },
];

export default function CmsStatCards({ stats, loading }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '1.5rem' }}>
      {CARD_CONFIGS.map((s) => {
        const value = loading ? '…' : s.format(stats?.[s.key]);

        return (
          <div
            key={s.key}
            onClick={() => navigate(s.to)}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.3rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${s.border}`,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
          >
            <div>
              <p style={{ color: '#7f8c8d', fontSize: '0.78rem', fontWeight: 500, margin: '0 0 0.3rem' }}>{s.label}</p>
              <h3 style={{ color: '#093269', fontSize: '1.9rem', fontWeight: 700, margin: 0 }}>{value}</h3>
              {s.sub && <p style={{ color: '#7f8c8d', fontSize: '0.7rem', margin: '0.3rem 0 0' }}>{s.sub}</p>}
            </div>
            <div style={{ background: s.iconBg, borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon style={{ color: s.iconColor, fontSize: '1.3rem' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}