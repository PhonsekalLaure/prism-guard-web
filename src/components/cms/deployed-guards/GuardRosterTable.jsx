import { useState } from 'react';
import { FaUsers, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const guards = [
  {
    initials: 'JC',
    avatarColor: '#093269',
    name: 'Juan Cruz',
    employeeId: 'PRISM-2024-001',
    since: 'Since Jan 15, 2024',
    shift: 'Day (6AM-6PM)',
    status: 'active',
  },
  {
    initials: 'MD',
    avatarColor: '#2563eb',
    name: 'Mario Dela Cruz',
    employeeId: 'PRISM-2024-006',
    since: 'Since Mar 08, 2024',
    shift: 'Night (6PM-6AM)',
    status: 'active',
  },
  {
    initials: 'RG',
    avatarColor: '#16a34a',
    name: 'Richielle Gutierrez',
    employeeId: 'PRISM-2024-005',
    since: 'Since Jun 22, 2024',
    shift: 'Day (6AM-6PM)',
    status: 'active',
  },
  {
    initials: 'CA',
    avatarColor: '#ca8a04',
    name: 'Christabelle Acedillo',
    employeeId: 'PRISM-2024-004',
    since: 'Since Sep 10, 2024',
    shift: 'Day (6AM-6PM)',
    status: 'on-leave',
  },
  {
    initials: 'QM',
    avatarColor: '#7c3aed',
    name: 'Quervie Manrique',
    employeeId: 'PRISM-2024-003',
    since: 'Since Nov 03, 2024',
    shift: 'Night (6PM-6AM)',
    status: 'active',
  },
];

const statusConfig = {
  'active': { label: 'Active', className: 'dg-status-badge dg-status-badge--active' },
  'on-leave': { label: 'On Leave', className: 'dg-status-badge dg-status-badge--leave' },
  'suspended': { label: 'Suspended', className: 'dg-status-badge dg-status-badge--suspended' },
  'replaced': { label: 'Temp Replaced', className: 'dg-status-badge dg-status-badge--replaced' },
};

export default function GuardRosterTable({ onViewGuard }) {
  const [sortBy, setSortBy] = useState('name-az');

  return (
    <div className="dg-table-panel">
      {/* Table Header */}
      <div className="dg-table-header">
        <h3 className="dg-table-title">
          <FaUsers /> Guard Roster
        </h3>
        <div className="dg-table-sort">
          <span className="dg-sort-label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="dg-sort-select"
          >
            <option value="name-az">Name (A-Z)</option>
            <option value="name-za">Name (Z-A)</option>
            <option value="date-newest">Deployment Date (Newest)</option>
            <option value="date-oldest">Deployment Date (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="dg-table-wrapper">
        <table className="dg-table">
          <thead>
            <tr>
              <th>Guard</th>
              <th>Employee ID</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {guards.map((guard) => {
              const badge = statusConfig[guard.status] || statusConfig['active'];
              return (
                <tr
                  key={guard.employeeId}
                  className="dg-table-row"
                  onClick={() => onViewGuard?.(guard)}
                >
                  <td>
                    <div className="dg-guard-cell">
                      <div
                        className="dg-guard-avatar-sm"
                        style={{ background: guard.avatarColor }}
                      >
                        {guard.initials}
                      </div>
                      <div>
                        <p className="dg-guard-name">{guard.name}</p>
                        <p className="dg-guard-since">{guard.since}</p>
                      </div>
                    </div>
                  </td>
                  <td className="dg-td-mono">{guard.employeeId}</td>
                  <td className="dg-td-muted">{guard.shift}</td>
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="dg-view-btn"
                      onClick={() => onViewGuard?.(guard)}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="dg-pagination">
        <span className="dg-pagination-info">Showing 1-5 of 24 guards</span>
        <div className="dg-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}