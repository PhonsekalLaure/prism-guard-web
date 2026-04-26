import { useState } from 'react';
import { FaBuilding, FaTag, FaList, FaFlag } from 'react-icons/fa';

export default function HrisSRFilterBar() {
  const [client, setClient]   = useState('all');
  const [status, setStatus]   = useState('all');
  const [type, setType]       = useState('all');

  return (
    <div className="sr-filter-bar">
      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaBuilding className="sr-filter-icon" /> Client
        </label>
        <select className="sr-filter-select" value={client} onChange={e => setClient(e.target.value)}>
          <option value="all">All Clients</option>
          <option value="feu">FEU Institute of Tech</option>
          <option value="sm">SM Mall of Asia</option>
          <option value="ayala">Ayala Corporation</option>
          <option value="bdo">BDO Unibank</option>
        </select>
      </div>

      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaTag className="sr-filter-icon" /> Status
        </label>
        <select className="sr-filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="sr-filter-group">
        <label className="sr-filter-label">
          <FaList className="sr-filter-icon" /> Type
        </label>
        <select className="sr-filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="inquiry">General Inquiry</option>
          <option value="replacement">Guard Replacement</option>
          <option value="additional">Additional Guard</option>
          <option value="schedule">Schedule Change</option>
        </select>
      </div>
    </div>
  );
}
