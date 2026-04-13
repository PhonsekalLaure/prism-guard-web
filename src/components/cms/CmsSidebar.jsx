import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaHeadset, FaExclamationTriangle,
  FaCreditCard, FaStar, FaBuilding, FaSignOutAlt,
  FaUserShield, FaFileInvoiceDollar, FaBars,
} from 'react-icons/fa';
import logo from '@assets/cms-logo.png';

const navGroups = [
  {
    label: null,
    labelIcon: null,
    items: [
      { to: '/cms/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    ],
  },
  {
    label: 'Guard Management',
    labelIcon: FaUserShield,
    items: [
      { to: '/cms/deployed-guards', icon: FaUsers, label: 'Deployed Guards' },
    ],
  },
  {
    label: 'Services',
    labelIcon: FaHeadset,
    items: [
      { to: '/cms/service-requests', icon: FaHeadset, label: 'Service Request' },
    ],
  },
  {
    label: 'Reports',
    labelIcon: FaBars,
    items: [
      { to: '/cms/incident-reports', icon: FaExclamationTriangle, label: 'Incidents' },
    ],
  },
  {
    label: 'Billing',
    labelIcon: FaFileInvoiceDollar,
    items: [
      { to: '/cms/billing', icon: FaCreditCard, label: 'Billing & Payments' },
    ],
  },
];

const bottomItems = [
  { to: '/cms/reviews', icon: FaStar, label: 'Service Reviews' },
];

export default function CmsSidebar({ onLogoutClick }) {
  return (
    <aside style={{
      width: '210px',
      minWidth: '210px',
      background: 'linear-gradient(180deg, #093269 0%, #0a4080 100%)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      fontFamily: 'Poppins, sans-serif',
    }}>

      {/* Logo */}
      <div style={{ padding: '1.2rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <img src={logo} alt="PRISM-Guard" style={{ width: '60px', height: '60px', objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.2 }}>PRISM-Guard</div> 
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.62rem' }}>Client Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.4rem 0', overflowY: 'auto' }}>
        {navGroups.map((group, gi) => {
          const LabelIcon = group.labelIcon;
          return (
            <div key={gi}>
              {group.label && (
                <div style={{ position: 'relative', padding: '0.75rem 1rem 0.25rem 1.3rem', marginTop: '0.2rem' }}>
                  <span style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', width: '3px', height: '14px', background: '#e6b215', borderRadius: '2px' }} />
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                    {LabelIcon && <LabelIcon style={{ color: '#e6b215', fontSize: '0.6rem' }} />}
                    {group.label}
                  </p>
                </div>
              )}
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 1rem 0.5rem 1.2rem',
                    fontSize: '0.83rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#e6b215' : 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    borderLeft: isActive ? '4px solid #e6b215' : '4px solid transparent',
                    background: isActive ? 'linear-gradient(90deg, rgba(230,178,21,0.18) 0%, transparent 100%)' : 'transparent',
                    transition: 'all 0.2s',
                  })}
                >
                  <Icon style={{ fontSize: '0.95rem', flexShrink: 0 }} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0.5rem 0' }} />

        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.5rem 1rem 0.5rem 1.2rem',
              fontSize: '0.83rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#e6b215' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              borderLeft: isActive ? '4px solid #e6b215' : '4px solid transparent',
              background: isActive ? 'linear-gradient(90deg, rgba(230,178,21,0.18) 0%, transparent 100%)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            <Icon style={{ fontSize: '0.95rem', flexShrink: 0 }} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem' }}>
        <NavLink to="/cms/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaBuilding style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>John Juan</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.63rem', margin: 0 }}>President</p>
          </div>
        </NavLink>
        <button
          onClick={onLogoutClick}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.48rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}