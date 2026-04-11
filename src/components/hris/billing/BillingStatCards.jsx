import { FaFileInvoiceDollar, FaCoins, FaExclamationTriangle } from 'react-icons/fa';
import '@styles/hris/StatCard.css';

const stats = [
  {
    label: 'Total Billed',
    value: '₱245,000',
    sub: '8 active clients',
    valueColor: '#093269',
    icon: FaFileInvoiceDollar,
    iconColor: '#093269',
    borderColor: '#093269',
  },
  {
    label: 'Total Collected',
    value: '₱201,000',
    sub: '4 clients paid',
    subColor: '#16a34a',
    valueColor: '#16a34a',
    icon: FaCoins,
    iconColor: '#16a34a',
    borderColor: '#16a34a',
  },
  {
    label: 'Total Unpaid',
    value: '₱44,000',
    sub: '2 clients unpaid',
    subColor: '#dc2626',
    valueColor: '#dc2626',
    icon: FaExclamationTriangle,
    iconColor: '#dc2626',
    borderColor: '#dc2626',
  },
];

export default function BillingStatCards() {
  return (
    <div className="stat-grid three-cols">
      {stats.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
            <p className="stat-sub" style={{ color: s.subColor || '#7f8c8d' }}>{s.sub}</p>
          </div>
          <div
            className="stat-icon"
            style={{ background: `${s.iconColor}15`, color: s.iconColor }}
          >
            <s.icon />
          </div>
        </div>
      ))}
    </div>
  );
}
