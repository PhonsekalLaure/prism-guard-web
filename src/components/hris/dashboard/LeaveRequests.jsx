import { FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RequestPanel from './RequestPanel';

export default function LeaveRequests({ requests, loading }) {
  const navigate = useNavigate();
  const rows = requests?.data || [];

  return (
    <RequestPanel
      emptyMessage="No pending leave requests."
      icon={FaCalendarAlt}
      itemCount={rows.length}
      linkTo="/leaves"
      loading={loading}
      title="Pending Leave Request"
    >
      {rows.map((request, index) => (
        <div
          key={request.id}
          className="request-item"
          style={{
            flex: rows.length > 1 ? 1 : '0 0 auto',
            minHeight: '112px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderBottom: index < rows.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <p className="req-name">{request.name}</p>
            <button className="review-btn" type="button" onClick={() => navigate(`/leaves/${request.id}`)}>Review</button>
          </div>
          <p className="req-type">{request.type}</p>
          <p className="req-time"><FaRegClock style={{ marginRight: 4 }} />{request.statusMeta}</p>
        </div>
      ))}
    </RequestPanel>
  );
}
