import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaTimesCircle, FaArrowRight } from 'react-icons/fa';

export default function UpcomingBilling() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#093269', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCalendarCheck /> Upcoming Billing
        </h3>
      </div>

      <div style={{ padding: '1.4rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#7f8c8d', textAlign: 'center', margin: '0 0 0.4rem' }}>Next Payment Due</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#093269', textAlign: 'center', margin: '0 0 0.3rem' }}>February 28, 2026</p>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e6b215', textAlign: 'center', margin: '0 0 1rem' }}>₱82,500.00</p>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaTimesCircle style={{ color: '#dc2626', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', margin: 0 }}>12 days until due date</p>
        </div>

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