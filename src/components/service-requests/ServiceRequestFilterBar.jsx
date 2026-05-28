import { FaBuilding, FaFlag, FaList, FaTag } from 'react-icons/fa';
import { SERVICE_REQUEST_TYPES } from '@/constants/serviceRequests';

const DEFAULT_FILTERS = { status: 'all', type: 'all', urgency: 'all' };

export default function ServiceRequestFilterBar({
  clients,
  filters,
  onFilterChange,
}) {
  const current = {
    ...(clients ? { clientId: 'all' } : {}),
    ...DEFAULT_FILTERS,
    ...(filters || {}),
  };
  const emit = (updates) => onFilterChange?.({ ...current, ...updates });

  return (
    <div className={`filter-bar ${clients ? 'four-cols' : 'three-cols'}`}>
      {clients && (
        <div className="filter-group">
          <label className="filter-label">
            <FaBuilding className="filter-icon" /> Client
          </label>
          <select
            className="filter-select"
            value={current.clientId}
            onChange={(event) => emit({ clientId: event.target.value })}
          >
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.company}</option>
            ))}
          </select>
        </div>
      )}

      <div className="filter-group">
        <label className="filter-label">
          <FaTag className="filter-icon" /> Status
        </label>
        <select
          className="filter-select"
          value={current.status}
          onChange={(event) => emit({ status: event.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaList className="filter-icon" /> Type
        </label>
        <select
          className="filter-select"
          value={current.type}
          onChange={(event) => emit({ type: event.target.value })}
        >
          <option value="all">All Types</option>
          {SERVICE_REQUEST_TYPES.map((requestType) => (
            <option key={requestType.value} value={requestType.value}>
              {requestType.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFlag className="filter-icon" /> Urgency
        </label>
        <select
          className="filter-select"
          value={current.urgency}
          onChange={(event) => emit({ urgency: event.target.value })}
        >
          <option value="all">All Urgencies</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </div>
  );
}
