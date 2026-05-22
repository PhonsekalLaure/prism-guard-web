import { FaListUl, FaFileAlt } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import authService from '@services/authService';
import { formatIncidentDate, titleCase } from './incidentReportFormatters';

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
  const limit = metadata.limit || incidents.length || 1;
  const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = Math.min(start + incidents.length - 1, total);

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
                <td className="ir-td-muted">{formatIncidentDate(inc.occurredAt || inc.createdAt)}</td>
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

      {total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={total}
          label="incidents"
          disabled={loading}
        />
      )}
    </div>
  );
}
