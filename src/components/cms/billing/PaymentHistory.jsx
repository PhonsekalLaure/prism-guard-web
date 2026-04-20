import { FaCheck, FaHourglassHalf, FaClock } from 'react-icons/fa';

const historyItems = [
  {
    icon: FaCheck,
    iconBg: '#16a34a',
    title: 'Payment Confirmed — INV-2026-040',
    ref: 'Bank Transfer • Ref: BDO-20260120-78945',
    amount: '₱82,500.00',
    amountColor: '#16a34a',
    time: 'Jan 20, 2026 at 2:15 PM',
    rowBg: '#f9fafb',
    rowBorder: '#e5e7eb',
  },
  {
    icon: FaHourglassHalf,
    iconBg: '#e6b215',
    title: 'Payment Under Verification — INV-2026-041',
    ref: 'GCash Transfer • Ref: GCASH-20260215-12345',
    amount: '₱43,000.00',
    amountColor: '#e6b215',
    time: 'Feb 15, 2026 at 10:30 AM',
    rowBg: '#fefce8',
    rowBorder: '#fde68a',
  },
  {
    icon: FaCheck,
    iconBg: '#16a34a',
    title: 'Payment Confirmed — INV-2025-039',
    ref: 'Bank Transfer • Ref: BDO-20260105-45678',
    amount: '₱82,500.00',
    amountColor: '#16a34a',
    time: 'Jan 05, 2026 at 9:00 AM',
    rowBg: '#f9fafb',
    rowBorder: '#e5e7eb',
  },
];

export default function PaymentHistory() {
  return (
    <div className="cms-ph-list">
      {historyItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="cms-ph-item"
            style={{ background: item.rowBg, borderColor: item.rowBorder }}
          >
            <div
              className="cms-ph-icon"
              style={{ background: item.iconBg }}
            >
              <Icon />
            </div>
            <div className="cms-ph-body">
              <div className="cms-ph-header-row">
                <div>
                  <p className="cms-ph-title">{item.title}</p>
                  <p className="cms-ph-ref">{item.ref}</p>
                </div>
                <p className="cms-ph-amount" style={{ color: item.amountColor }}>
                  {item.amount}
                </p>
              </div>
              <p className="cms-ph-time">
                <FaClock className="cms-ph-clock" />
                {item.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}