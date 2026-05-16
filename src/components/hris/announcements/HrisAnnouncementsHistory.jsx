import { useState } from 'react';
import {
  FaHistory, FaBullhorn, FaEye, FaChevronLeft, FaChevronRight,
  FaTimes, FaArrowLeft,
} from 'react-icons/fa';

const initialData = [
  {
    id: 'ANN-2026-024',
    subject: 'Holiday Schedule Adjustment',
    audience: 'All',
    audienceClass: 'aud-all',
    priority: 'Important',
    priorityClass: 'pri-important',
    date: 'Feb 22, 2026',
    status: 'Active',
    statusClass: 'st-active',
    iconClass: 'important',
    publishedBy: 'Admin (President)',
    message:
      'Please be informed that the office and all client sites will observe modified working hours during the upcoming Holy Week. Day shift guards will report from 6:00 AM to 2:00 PM, while night shift will remain unchanged. Clients are advised to coordinate with their assigned supervisors for any special arrangements. This takes effect from April 14-19, 2026.',
  },
  {
    id: 'ANN-2026-023',
    subject: 'Uniform Compliance Reminder',
    audience: 'Guards Only',
    audienceClass: 'aud-guards',
    priority: 'Urgent',
    priorityClass: 'pri-urgent',
    date: 'Feb 20, 2026',
    status: 'Active',
    statusClass: 'st-active',
    iconClass: 'urgent',
    publishedBy: 'Admin (President)',
    message:
      'All security guards are reminded to strictly comply with the prescribed uniform policy effective immediately. Complete uniform includes: company polo, black tactical pants, issued cap, name plate, and black shoes. Guards found non-compliant will be given a written warning. Please coordinate with your team leader for uniform issuance.',
  },
  {
    id: 'ANN-2026-022',
    subject: 'Monthly Billing Statement Ready',
    audience: 'Clients Only',
    audienceClass: 'aud-clients',
    priority: 'Normal',
    priorityClass: 'pri-normal',
    date: 'Feb 18, 2026',
    status: 'Active',
    statusClass: 'st-active',
    iconClass: 'normal',
    publishedBy: 'Admin (President)',
    message:
      'Dear valued clients, your monthly billing statement for the period of February 1-15, 2026 is now available. Please check your email or access the Client Portal to view and download your SOA. For any billing inquiries, please contact our finance department at billing@prismguard.com.',
  },
  {
    id: 'ANN-2026-021',
    subject: 'New Guard Deployment Protocol',
    audience: 'Guards Only',
    audienceClass: 'aud-guards',
    priority: 'Important',
    priorityClass: 'pri-important',
    date: 'Feb 15, 2026',
    status: 'Expired',
    statusClass: 'st-expired',
    iconClass: 'expired',
    publishedBy: 'Admin (President)',
    message:
      'Effective February 20, 2026, all newly deployed guards must attend a mandatory 2-hour site orientation before their first shift. Orientation will cover site-specific protocols, emergency procedures, and client expectations. Team leaders are responsible for scheduling orientations with the Operations department.',
  },
  {
    id: 'ANN-2026-020',
    subject: 'System Maintenance Notice',
    audience: 'All',
    audienceClass: 'aud-all',
    priority: 'Normal',
    priorityClass: 'pri-normal',
    date: 'Feb 12, 2026',
    status: 'Expired',
    statusClass: 'st-expired',
    iconClass: 'expired',
    publishedBy: 'Admin (President)',
    message:
      'The PRISM-GUARD system will undergo scheduled maintenance on February 14, 2026 from 12:00 AM to 4:00 AM. During this period, the Client Portal and Guard Mobile App may experience intermittent downtime. All attendance logs will be synced automatically after maintenance is complete. We apologize for any inconvenience.',
  },
];

function ViewModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="an-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="an-modal">
        <div className="an-modal-header">
          <div>
            <h2>Announcement Details</h2>
            <p>{item.id}</p>
          </div>
          <button className="an-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="an-modal-body">
          {/* Badges */}
          <div className="an-modal-badges">
            <span className={`an-badge ${item.audienceClass}`}>{item.audience}</span>
            <span className={`an-badge ${item.priorityClass}`}>{item.priority}</span>
            <span className={`an-badge ${item.statusClass}`}>{item.status}</span>
          </div>

          {/* Subject */}
          <div className="an-modal-cell">
            <label>Subject</label>
            <p>{item.subject}</p>
          </div>

          {/* Published By / Date */}
          <div className="an-modal-grid">
            <div className="an-modal-cell">
              <label>Published By</label>
              <p>{item.publishedBy}</p>
            </div>
            <div className="an-modal-cell">
              <label>Date Published</label>
              <p>{item.date}</p>
            </div>
          </div>

          {/* Message */}
          <div className="an-modal-message">
            <label>Message</label>
            <p>{item.message}</p>
          </div>

          {/* Back */}
          <div className="an-modal-actions">
            <button className="an-back-btn" onClick={onClose}>
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisAnnouncementsHistory({ extraRows }) {
  const [selected, setSelected] = useState(null);
  const rows = [...extraRows, ...initialData];

  return (
    <div className="an-table-container">
      <div className="an-table-header">
        <h3><FaHistory /> Announcement History</h3>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Audience</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.id}-${i}`} onClick={() => setSelected(row)}>
                <td className="an-id-cell">{row.id}</td>
                <td>
                  <div className="an-subject-cell">
                    <div className={`an-subject-icon ${row.iconClass}`}>
                      <FaBullhorn />
                    </div>
                    <span className="an-subject-text">{row.subject}</span>
                  </div>
                </td>
                <td><span className={`an-badge ${row.audienceClass}`}>{row.audience}</span></td>
                <td><span className={`an-badge ${row.priorityClass}`}>{row.priority}</span></td>
                <td style={{ color: '#4b5563' }}>{row.date}</td>
                <td><span className={`an-badge ${row.statusClass}`}>{row.status}</span></td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="an-view-btn" onClick={() => setSelected(row)}>
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="an-pagination">
        <p className="an-pagination-text">Showing 1-{rows.length} of {rows.length + 19} announcements</p>
        <div className="an-pagination-controls">
          <button className="an-page-btn" disabled><FaChevronLeft /></button>
          <button className="an-page-btn active">1</button>
          <button className="an-page-btn">2</button>
          <button className="an-page-btn">3</button>
          <button className="an-page-btn"><FaChevronRight /></button>
        </div>
      </div>

      {/* View Modal */}
      {selected && <ViewModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
