import {
  FaListAlt, FaUserPlus, FaExchangeAlt, FaClock,
  FaQuestionCircle, FaChevronLeft, FaChevronRight, FaEye,
} from 'react-icons/fa';

const requests = [
  {
    id: 'SR-2026-048',
    typeIcon: <FaUserPlus className="sr-type-icon sr-type-icon--blue" />,
    type: 'Additional Guard',
    site: 'Main Gate',
    urgency: 'Emergency',
    urgencyClass: 'sr-urgency-badge sr-urgency-badge--emergency',
    date: 'Feb 16, 2026',
    status: 'Open',
    statusClass: 'sr-status-badge sr-status-badge--open',
  },
  {
    id: 'SR-2026-047',
    typeIcon: <FaExchangeAlt className="sr-type-icon sr-type-icon--gold" />,
    type: 'Guard Replacement',
    site: 'Parking Area',
    urgency: 'Urgent',
    urgencyClass: 'sr-urgency-badge sr-urgency-badge--urgent',
    date: 'Feb 15, 2026',
    status: 'In Progress',
    statusClass: 'sr-status-badge sr-status-badge--in-progress',
  },
  {
    id: 'SR-2026-045',
    typeIcon: <FaClock className="sr-type-icon sr-type-icon--green" />,
    type: 'Schedule Change',
    site: 'Back Gate',
    urgency: 'Normal',
    urgencyClass: 'sr-urgency-badge sr-urgency-badge--normal',
    date: 'Feb 14, 2026',
    status: 'Resolved',
    statusClass: 'sr-status-badge sr-status-badge--resolved',
  },
  {
    id: 'SR-2026-042',
    typeIcon: <FaQuestionCircle className="sr-type-icon sr-type-icon--purple" />,
    type: 'General Inquiry',
    site: 'All Sites',
    urgency: 'Normal',
    urgencyClass: 'sr-urgency-badge sr-urgency-badge--normal',
    date: 'Feb 12, 2026',
    status: 'Resolved',
    statusClass: 'sr-status-badge sr-status-badge--resolved',
  },
];

export default function ServiceRequestsTable({ onViewRequest }) {
  return (
    <div className="sr-table-panel">
      <div className="sr-table-header">
        <h3 className="sr-table-title">
          <FaListAlt /> All Requests
        </h3>
      </div>

      <div className="sr-table-wrapper">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Type</th>
              <th>Site</th>
              <th>Urgency</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="sr-table-row"
                onClick={() => onViewRequest?.(req)}
              >
                <td className="sr-td-id">{req.id}</td>
                <td className="sr-td-type">
                  {req.typeIcon}
                  {req.type}
                </td>
                <td className="sr-td-muted">{req.site}</td>
                <td>
                  <span className={req.urgencyClass}>{req.urgency}</span>
                </td>
                <td className="sr-td-muted">{req.date}</td>
                <td>
                  <span className={req.statusClass}>{req.status}</span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    className="sr-view-btn"
                    onClick={() => onViewRequest?.(req)}
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sr-pagination">
        <span className="sr-pagination-info">Showing 1-4 of 38 requests</span>
        <div className="sr-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}