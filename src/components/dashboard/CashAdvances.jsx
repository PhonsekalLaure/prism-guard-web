import { FaHandHoldingUsd, FaRegClock, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const advances = [
  { name: 'Juan Cruz', reason: 'Medical Emergency', amount: '₱3,000', time: '1 hour ago' },
  { name: 'Mario Dela Cruz', reason: 'Utility Bills', amount: '₱2,000', time: '2 hour ago' },
  { name: 'Juan Cruz', reason: 'Other', amount: '₱1,000', time: '1 day ago' },
];

export default function CashAdvances() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3><FaHandHoldingUsd /> Pending Cash Advances</h3>
      </div>

      <div>
        {advances.map((a, i) => (
          <div
            key={i}
            className="request-item"
            style={{ borderBottom: i < advances.length - 1 ? '1px solid #f0f0f0' : 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <p className="req-name">{a.name}</p>
              <button className="review-btn">Review</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="req-type">{a.reason}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#093269', margin: 0 }}>{a.amount}</p>
            </div>
            <p className="req-time"><FaRegClock style={{ marginRight: 4 }} />{a.time}</p>
          </div>
        ))}
      </div>

      <Link to="/cash-advance" className="panel-link">
        View All Requests <FaArrowRight style={{ marginLeft: 4, fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
