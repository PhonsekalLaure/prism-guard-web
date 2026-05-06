import { useState } from 'react';
import { FaTag, FaList, FaFlag } from 'react-icons/fa';

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
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaTag className="filter-icon" /> Status
        </label>
        <select
          value={status}
          onChange={(e) => emit({ status: e.target.value })}
          className="filter-select"
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
          value={type}
          onChange={(e) => emit({ type: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="general_inquiry">General Inquiry</option>
          <option value="guard_replacement">Guard Replacement</option>
          <option value="additional_guard">Additional Guard</option>
          <option value="schedule_change">Schedule Change</option>
          <option value="operations">Operations</option>
          <option value="billing">Billing</option>
          <option value="incident_followup">Incident Followup</option>
          <option value="client_request">Client Request</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFlag className="filter-icon" /> Urgency
        </label>
        <select
          value={urgency}
          onChange={(e) => emit({ urgency: e.target.value })}
          className="filter-select"
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