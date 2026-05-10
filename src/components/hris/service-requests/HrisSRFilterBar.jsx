import { FaBuilding, FaTag, FaList, FaFlag } from 'react-icons/fa';
import { SERVICE_REQUEST_TYPES } from '@/constants/serviceRequests';

export default function HrisSRFilterBar({ clients = [], filters, onFilterChange }) {
  const current = filters || { clientId: 'all', status: 'all', type: 'all', urgency: 'all' };
  const emit = (updates) => onFilterChange?.({ ...current, ...updates });

  return (
    <div className="sr-filter-bar">
      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaBuilding className="sr-filter-icon" /> Client
        </label>
        <select className="sr-filter-select" value={current.clientId} onChange={e => emit({ clientId: e.target.value })}>
          <option value="all">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.company}</option>
          ))}
        </select>
      </div>

      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaTag className="sr-filter-icon" /> Status
        </label>
        <select className="sr-filter-select" value={current.status} onChange={e => emit({ status: e.target.value })}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaList className="sr-filter-icon" /> Type
        </label>
        <select className="sr-filter-select" value={current.type} onChange={e => emit({ type: e.target.value })}>
          <option value="all">All Types</option>
          {SERVICE_REQUEST_TYPES.map((requestType) => (
            <option key={requestType.value} value={requestType.value}>{requestType.label}</option>
          ))}
        </select>
      </div>

      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaFlag className="sr-filter-icon" /> Urgency
        </label>
        <select className="sr-filter-select" value={current.urgency} onChange={e => emit({ urgency: e.target.value })}>
          <option value="all">All Urgencies</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </div>
  );
}
