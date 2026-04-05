import { FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const contracts = [
  {
    initials: 'FIT', bgColor: '#093269',
    company: 'FEU Institute of Technology', address: 'Sampaloc, Manila',
    manpower: '8 Guards', status: 'Full', statusClass: 'full',
  },
  {
    initials: 'SM', bgColor: '#dc2626',
    company: 'SM Mall of Asia', address: 'Pasay City',
    manpower: '5 Guards', status: 'Full', statusClass: 'full',
  },
  {
    initials: 'SM', bgColor: '#2563eb',
    company: 'SM North Edsa', address: 'Quezon City',
    manpower: '9 Guards', status: 'Understaffed', statusClass: 'understaffed',
  },
];

export default function ManpowerTable() {
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
            {contracts.map((c, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div className="company-badge" style={{ background: c.bgColor }}>
                      {c.initials}
                    </div>
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{c.company}</span>
                  </div>
                </td>
                <td style={{ color: '#7f8c8d' }}>{c.address}</td>
                <td style={{ fontWeight: 500, color: '#2c3e50' }}>{c.manpower}</td>
                <td>
                  <span className={`status-badge ${c.statusClass}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel-pagination">
        <span className="info">Showing 1-3 of 24 contracts</span>
        <div className="page-btns">
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
