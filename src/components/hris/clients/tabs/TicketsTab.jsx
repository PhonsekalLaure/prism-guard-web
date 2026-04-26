import { FaTicketAlt } from 'react-icons/fa';
import { fmtDate } from './ClientInfoCell';

const priorityColor = (p) =>
  p === 'urgent' ? '#dc2626' : p === 'high' ? '#d97706' : '#2563eb';

const statusColor = (s) =>
  s === 'resolved' ? '#16a34a' : s === 'in_progress' ? '#2563eb' : '#d97706';

export default function TicketsTab({ client }) {
  const tickets = client.service_tickets || [];

  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaTicketAlt className="vc-section-icon" /> Service Tickets
        </h3>

        {tickets.length > 0 ? (
          <div className="vc-tickets-list">
            {tickets.map((t, i) => (
              <div key={t.id || i} className="vc-ticket-card">
                <div className="vc-ticket-header">
                  <div>
                    <p className="vc-ticket-subject">{t.subject}</p>
                    <p className="vc-ticket-type">{t.ticket_type}</p>
                  </div>
                  <div className="vc-ticket-badges">
                    <span
                      className="vc-ticket-badge"
                      style={{ color: priorityColor(t.priority), borderColor: priorityColor(t.priority) }}
                    >
                      {t.priority?.toUpperCase()}
                    </span>
                    <span className="vc-ticket-status" style={{ color: statusColor(t.status) }}>
                      ● {t.status?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="vc-ticket-desc">{t.description}</p>
                <p className="vc-ticket-date">Created: {fmtDate(t.created_at)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="vc-empty">
            <FaTicketAlt className="vc-empty-icon" />
            <p className="vc-empty-text">No service tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
