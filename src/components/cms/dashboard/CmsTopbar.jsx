import { FaDownload } from 'react-icons/fa';

export default function CmsTopbar({ companyName, loading }) {
  return (
    <header style={{ background: '#fff', padding: '1.2rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#093269', margin: 0 }}>
          {loading
            ? 'Loading…'
            : `Welcome back, ${companyName || 'Client'}`}
        </h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#093269', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
          <FaDownload />
          Download Reports
        </button>
      </div>
    </header>
  );
}