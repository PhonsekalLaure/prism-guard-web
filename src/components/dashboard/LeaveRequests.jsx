import { FaCalendarAlt, FaRegClock, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const requests = [
  { name: 'Ronn Rosarito', type: 'Sick Leave', time: '1 hour ago' },
  { name: 'Quervie Manrique', type: 'Vacation Leave', time: '2 hour ago' },
  { name: 'Juan Cruz', type: 'Emergency Leave', time: '1 day ago' },
];

export default function LeaveRequests() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3><FaCalendarAlt /> Pending Leave Request</h3>
      </div>

      <div>
        {requests.map((r, i) => (
          <div
            key={i}
            className="request-item"
            style={{ borderBottom: i < requests.length - 1 ? '1px solid #f0f0f0' : 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
              <p className="req-name">{r.name}</p>
              <button className="review-btn">Review</button>
            </div>
            <p className="req-type">{r.type}</p>
            <p className="req-time"><FaRegClock style={{ marginRight: 4 }} />{r.time}</p>
          </div>
        ))}
      </div>

      <Link to="/leaves" className="panel-link">
        View All Requests <FaArrowRight style={{ marginLeft: 4, fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
