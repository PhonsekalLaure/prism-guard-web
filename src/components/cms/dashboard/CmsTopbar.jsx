import { useState } from 'react';
import { FaBell, FaDownload } from 'react-icons/fa';
import NotificationDropdown from '../ui/NotificationDropdown';

export default function CmsTopbar() {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header style={{ background: '#fff', padding: '1.2rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#093269', margin: 0 }}>
          Welcome back, FEU Institute of Technology
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowNotif(v => !v); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7f8c8d', position: 'relative', fontSize: '1.2rem' }}
            >
              <FaBell />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>7</span>
            </button>
            {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#093269', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            <FaDownload />
            Download Reports
          </button>
        </div>
      </div>
    </header>
  );
}