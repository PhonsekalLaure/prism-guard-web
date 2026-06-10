import { FaUsers, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { TableSkeletonRows } from '@components/ui/Skeleton';
import EntityAvatar from '@components/ui/EntityAvatar';

export default function ManpowerTable({ manpower, loading }) {
  const contracts = manpower?.data || [];
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <h3><FaUsers /> Manpower Distribution</h3>
      </div>

      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Address</th>
              <th>Manpower</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows
                rows={3}
                columns={4}
                getCellStyle={(column) => ({
                  height: column === 3 ? 22 : 14,
                  width: column === 0 ? '80%' : column === 3 ? 82 : '70%',
                  borderRadius: column === 3 ? 999 : 4,
                })}
              />
            ) : contracts.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>No active clients found.</td></tr>
            ) : contracts.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <EntityAvatar
                      avatarUrl={c.avatarUrl}
                      initials={c.initials}
                      alt={`${c.company} avatar`}
                      className="company-badge"
                      style={{ background: '#093269' }}
                    />
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{c.company}</span>
                  </div>
                </td>
                <td style={{ color: '#7f8c8d' }}>{c.address}</td>
                <td style={{ fontWeight: 500, color: '#2c3e50' }}>
                  {c.activeGuards} {c.activeGuards === 1 ? 'Guard' : 'Guards'}
                </td>
                <td>
                  <span className={`status-badge ${c.statusClass}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/clients" className="panel-link">
        View All Clients <FaArrowRight style={{ fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
