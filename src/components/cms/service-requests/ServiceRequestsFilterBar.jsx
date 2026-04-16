import { useState } from 'react';
import { FaTag, FaList, FaFlag } from 'react-icons/fa';

export default function ServiceRequestsFilterBar({ onFilterChange }) {
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [urgency, setUrgency] = useState('all');

  const handleStatus = (e) => {
    setStatus(e.target.value);
    onFilterChange?.({ status: e.target.value, type, urgency });
  };

  const handleType = (e) => {
    setType(e.target.value);
    onFilterChange?.({ status, type: e.target.value, urgency });
  };

  const handleUrgency = (e) => {
    setUrgency(e.target.value);
    onFilterChange?.({ status, type, urgency: e.target.value });
  };

  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaTag className="filter-icon" />
          Status
        </label>
        <select value={status} onChange={handleStatus} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaList className="filter-icon" />
          Type
        </label>
        <select value={type} onChange={handleType} className="filter-select">
          <option value="all">All Types</option>
          <option value="general">General Inquiry</option>
          <option value="replacement">Guard Replacement</option>
          <option value="additional">Additional Guard</option>
          <option value="schedule">Schedule Change</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFlag className="filter-icon" />
          Urgency
        </label>
        <select value={urgency} onChange={handleUrgency} className="filter-select">
          <option value="all">All</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </div>
  );
}