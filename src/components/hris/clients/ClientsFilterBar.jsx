import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function ClientsFilterBar() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  return (
    <div className="clients-filter-bar">
      <div>
        <label><FaSearch /> Search Client</label>
        <input
          type="text"
          placeholder="Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <label><FaFilter /> Contract Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>
    </div>
  );
}
