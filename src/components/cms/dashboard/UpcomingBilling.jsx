import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaTimesCircle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

function formatCurrency(amount) {
  if (amount == null) return '—';
  return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function UpcomingBilling({ billing, loading }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCalendarCheck /> Upcoming Billing
        </h3>
      </div>

      <div style={{ padding: '1.4rem' }}>
        {loading ? (
          <>
            <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '0.6rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '28px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '0.4rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '22px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </>
        ) : billing ? (
          <>
            <p style={{ fontSize: '0.75rem', color: '#7f8c8d', textAlign: 'center', margin: '0 0 0.4rem' }}>Next Payment Due</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#093269', textAlign: 'center', margin: '0 0 0.3rem' }}>
              {billing.due_date_formatted}
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e6b215', textAlign: 'center', margin: '0 0 1rem' }}>
              {formatCurrency(billing.amount)}
            </p>

            {billing.days_until_due <= 7 ? (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaTimesCircle style={{ color: '#dc2626', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', margin: 0 }}>
                  {billing.days_until_due === 0
                    ? 'Due today!'
                    : `${billing.days_until_due} day${billing.days_until_due === 1 ? '' : 's'} until due date`}
                </p>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheckCircle style={{ color: '#15803d', flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', margin: 0 }}>
                  {billing.days_until_due} days until due date
                </p>
              </div>
            )}
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '0.85rem', margin: '1rem 0' }}>No upcoming payments</p>
        )}

        <Link
          to="/cms/billing"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#093269', color: '#fff', borderRadius: '8px', padding: '0.65rem', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}
        >
          View Billing Details <FaArrowRight style={{ fontSize: '0.7rem' }} />
        </Link>
      </div>
    </div>
  );
}