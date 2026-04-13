import {
  FaMapMarkerAlt, FaUsers, FaEnvelope, FaEye, FaUser,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

const clients = [
  {
    initials: 'FIT',
    initialsColor: '#093269',
    headerBg: '#093269',
    company: 'FEU Institute of Technology',
    contact: 'Engr. Benson Tan',
    status: 'ACTIVE',
    location: 'Sampaloc, Manila',
    guards: '8 Guards Assigned',
    email: 'betan@feutech.com',
  },
  {
    initials: 'SM',
    initialsColor: '#dc2626',
    headerBg: '#dc2626',
    company: 'SM Mall of Asia',
    contact: 'Ms. Sarah Lim',
    status: 'ACTIVE',
    location: 'Pasay City',
    guards: '5 Guards Assigned',
    email: 'salim@smmoa.com',
  },
  {
    initials: 'SM',
    initialsColor: '#7c3aed',
    headerBg: '#7c3aed',
    company: 'SM North EDSA',
    contact: 'Mr. Robert Go',
    status: 'ACTIVE',
    location: 'Quezon City',
    guards: '9 Guards Assigned',
    email: 'rogo@smnrth.com',
  },
  {
    initials: 'RG',
    initialsColor: '#d97706',
    headerBg: '#d97706',
    company: 'Robinsons Galleria',
    contact: 'Ms. Jennifer Sy',
    status: 'ACTIVE',
    location: 'Sampaloc, Manila',
    guards: '16 Guards Assigned',
    email: 'jensy@rob.com',
  },
  {
    initials: 'AM',
    initialsColor: '#dc2626',
    headerBg: '#dc2626',
    company: 'Ayala Malls Manila Bay',
    contact: 'Mr. Jaime Zobel',
    status: 'ACTIVE',
    location: 'Parañaque City',
    guards: '20 Guards Assigned',
    email: 'jazobel@ayala.com',
  },
  {
    initials: 'VH',
    initialsColor: '#059669',
    headerBg: '#059669',
    company: 'Vista Heights Subdivision',
    contact: 'Mrs. Corazon Villareal',
    status: 'ACTIVE',
    location: 'Parañaque City',
    guards: '8 Guards Assigned',
    email: 'covillareal@vista.com',
  },
];

export default function ClientsGrid() {
  return (
    <>
      <div className="clients-grid">
        {clients.map((c, i) => (
          <div key={i} className="client-card">
            {/* Colored header */}
            <div className="client-card-header" style={{ background: c.headerBg }}>
              <div className="card-initials" style={{ color: c.initialsColor }}>
                {c.initials}
              </div>
              <span className="status-pill">{c.status}</span>
              <h4>{c.company}</h4>
              <div className="contact-person">
                <FaUser style={{ fontSize: '0.6rem' }} />
                {c.contact}
              </div>
            </div>

            {/* Body */}
            <div className="client-card-body">
              <div className="info-row">
                <FaMapMarkerAlt />
                <span>{c.location}</span>
              </div>
              <div className="info-row">
                <FaUsers />
                <span>{c.guards}</span>
              </div>
              <div className="info-row">
                <FaEnvelope />
                <span>{c.email}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="client-card-footer">
              <button className="view-link">
                <FaEye />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="clients-pagination">
        <button className="page-btn"><FaChevronLeft /></button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn"><FaChevronRight /></button>
      </div>
    </>
  );
}
