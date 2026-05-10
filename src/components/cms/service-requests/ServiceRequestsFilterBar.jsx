import { useState } from 'react';
import { FaTag, FaList, FaFlag } from 'react-icons/fa';
import { SERVICE_REQUEST_TYPES } from '@/constants/serviceRequests';

export default function ServiceRequestsFilterBar({ onFilterChange }) {
  const [status, setStatus]   = useState('all');
  const [type, setType]       = useState('all');
  const [urgency, setUrgency] = useState('all');

  const emit = (updates) => {
    const next = { status, type, urgency, ...updates };
    setStatus(next.status);
    setType(next.type);
    setUrgency(next.urgency);
    onFilterChange?.(next);
  };

  return (
    <div className="sr-filter-bar">
      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaTag className="sr-filter-icon" /> Status
        </label>
        <select
          value={status}
          onChange={(e) => emit({ status: e.target.value })}
          className="sr-filter-select"
        >
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
        <select
          value={type}
          onChange={(e) => emit({ type: e.target.value })}
          className="sr-filter-select"
        >
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
        <select
          value={urgency}
          onChange={(e) => emit({ urgency: e.target.value })}
          className="sr-filter-select"
        >
          <option value="all">All</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </div>
  );
}
