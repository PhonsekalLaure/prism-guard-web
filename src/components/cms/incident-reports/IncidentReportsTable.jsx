import { FaListUl, FaFileAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import authService from '@services/authService';

function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function severityClass(severity) {
  return `ir-badge ir-badge--${severity || 'low'}`;
}

function statusClass(status) {
  if (status === 'resolved') return 'ir-badge ir-badge--resolved';
  if (status === 'approved') return 'ir-badge ir-badge--monitoring';
  return 'ir-badge ir-badge--investigating';
}

export default function IncidentReportsTable({
  incidents = [],
  loading = false,
  metadata = {},
  onPageChange,
  onViewIncident,
  onRequestReport,
}) {
  const page = metadata.page || 1;
  const totalPages = metadata.totalPages || 1;
  const total = metadata.total || 0;

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
            {loading && (
              <tr>
                <td colSpan={7} className="ir-td-muted">Loading incident reports...</td>
              </tr>
            )}

            {!loading && incidents.length === 0 && (
              <tr>
                <td colSpan={7} className="ir-td-muted">No incident reports found.</td>
              </tr>
            )}

            {!loading && incidents.map((inc) => (
              <tr key={inc.id} className="ir-table-row">
                <td className="ir-td-muted">{formatDate(inc.createdAt)}</td>
                <td className="ir-td-id">{inc.reportId}</td>
                <td>{inc.siteName}</td>
                <td>{titleCase(inc.category)}</td>
                <td>
                  <span className={severityClass(inc.severity)}>{titleCase(inc.severity)}</span>
                </td>
                <td>
                  <span className={statusClass(inc.status)}>{titleCase(inc.status)}</span>
                </td>
                <td>
                  <div className="ir-row-actions">
                    <button
                      className="ir-request-btn secondary"
                      onClick={() => onViewIncident?.(inc)}
                    >
                      View
                    </button>
                    <button
                      className="ir-request-btn"
                      disabled={['pending', 'approved', 'sent'].includes(inc.requestStatus)}
                      onClick={() => onRequestReport?.(inc)}
                    >
                      <FaFileAlt />
                      {inc.requestStatus === 'rejected'
                        ? 'Request Again'
                        : inc.requestStatus
                          ? titleCase(inc.requestStatus)
                          : 'Request Full Report'}
                    </button>
                    {inc.clientReportUrl && (
                      <button
                        className="ir-request-btn secondary"
                        onClick={() => authService.openFileUrl(inc.clientReportUrl)}
                      >
                        <FaFileAlt />
                        Open Full Report
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ir-pagination">
        <span className="ir-pagination-info">Showing {incidents.length} of {total} incidents</span>
        <div className="ir-page-btns">
          <button
            className="page-btn"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            <FaChevronLeft />
          </button>
          <button className="page-btn active">{page}</button>
          <button
            className="page-btn"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
