import { FaListUl, FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const incidents = [
  {
    date: 'Feb 16, 2026',
    id: 'INC-2026-012',
    site: 'Main Gate',
    type: 'Unauthorized Access',
    severity: 'High',
    severityClass: 'ir-badge ir-badge--high',
    status: 'Investigating',
    statusClass: 'ir-badge ir-badge--investigating',
  },
  {
    date: 'Feb 15, 2026',
    id: 'INC-2026-011',
    site: 'Parking Area',
    type: 'Property Damage',
    severity: 'Medium',
    severityClass: 'ir-badge ir-badge--medium',
    status: 'Monitoring',
    statusClass: 'ir-badge ir-badge--monitoring',
  },
  {
    date: 'Feb 14, 2026',
    id: 'INC-2026-010',
    site: 'Building Lobby',
    type: 'Visitor Incident',
    severity: 'Low',
    severityClass: 'ir-badge ir-badge--low',
    status: 'Resolved',
    statusClass: 'ir-badge ir-badge--resolved',
  },
  {
    date: 'Feb 13, 2026',
    id: 'INC-2026-009',
    site: 'Back Gate',
    type: 'Suspicious Activity',
    severity: 'Low',
    severityClass: 'ir-badge ir-badge--low',
    status: 'Resolved',
    statusClass: 'ir-badge ir-badge--resolved',
  },
  {
    date: 'Feb 12, 2026',
    id: 'INC-2026-008',
    site: 'Main Gate',
    type: 'Lost Item Recovery',
    severity: 'Medium',
    severityClass: 'ir-badge ir-badge--medium',
    status: 'Resolved',
    statusClass: 'ir-badge ir-badge--resolved',
  },
];

export default function IncidentReportsTable({ onRequestReport }) {
  return (
    <div className="ir-table-panel">
      <div className="ir-table-header">
        <h3 className="ir-table-title">
          <FaListUl /> Incident Records
        </h3>
      </div>

      <div className="ir-table-wrapper">
        <table className="ir-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Incident ID</th>
              <th>Site</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} className="ir-table-row">
                <td className="ir-td-muted">{inc.date}</td>
                <td className="ir-td-id">{inc.id}</td>
                <td>{inc.site}</td>
                <td>{inc.type}</td>
                <td>
                  <span className={inc.severityClass}>{inc.severity}</span>
                </td>
                <td>
                  <span className={inc.statusClass}>{inc.status}</span>
                </td>
                <td>
                  <button
                    className="ir-request-btn"
                    onClick={() => onRequestReport?.(inc)}
                  >
                    <FaFileAlt />
                    Request Full Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ir-pagination">
        <span className="ir-pagination-info">Showing 1-5 of 12 incidents</span>
        <div className="ir-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}