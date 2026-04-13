import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaHeadset, FaExclamationTriangle,
  FaCreditCard, FaStar, FaBuilding, FaSignOutAlt,
  FaUserShield, FaFileInvoiceDollar, FaBars,
} from 'react-icons/fa';
import logo from '@assets/logo.png';

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

const navItemStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.45rem 1.2rem',
  fontSize: '0.85rem',
  fontWeight: isActive ? 600 : 500,
  color: isActive ? '#e6b215' : 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  borderLeft: isActive ? '4px solid #e6b215' : '4px solid transparent',
  borderRadius: isActive ? '0 0.5rem 0.5rem 0' : undefined,
  background: isActive
    ? 'linear-gradient(90deg, rgba(230,178,21,0.2) 0%, transparent 100%)'
    : 'transparent',
  transition: 'all 0.3s ease',
});

const iconStyle = { width: '20px', textAlign: 'center', fontSize: '1rem', flexShrink: 0 };

const Divider = () => (
  <div style={{
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
    margin: '0.3rem 0',
  }} />
);

export default function CmsSidebar({ onLogoutClick }) {
  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      background: 'linear-gradient(180deg, #093269 0%, #0a4080 100%)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      fontFamily: 'Poppins, sans-serif',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* ── Logo — matches HRIS header exactly ── */}
      <div style={{
        padding: '1.4rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <img
          src={logo}
          alt="PRISM-Guard"
          style={{
            width: '65px',
            height: 'auto',
            transform: 'scale(1.99)',
            transformOrigin: 'center',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.3px' }}>
            PRISM-Guard
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem' }}>
            Client Portal
          </div>
        </div>
      </div>

      {/* ── Nav groups ── */}
      <nav style={{ flex: 1, padding: '0.6rem 0', overflowY: 'auto' }}>
        {navGroups.map((group, gi) => {
          const LabelIcon = group.labelIcon;
          return (
            <div key={gi}>
              {gi > 0 && <Divider />}
              {group.label && (
                <div style={{
                  position: 'relative',
                  padding: '0.3rem 1.2rem 0.2rem 1.5rem',
                  marginTop: '0.35rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '14px',
                    background: '#e6b215',
                    borderRadius: '2px',
                  }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {LabelIcon && <LabelIcon style={{ color: '#e6b215', fontSize: '0.65rem' }} />}
                    {group.label}
                  </span>
                </div>
              )}
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} style={({ isActive }) => navItemStyle(isActive)}>
                  <Icon style={iconStyle} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}

        {/* ── Service Reviews + spacer to push footer down ── */}
        <Divider />
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => navItemStyle(isActive)}>
            <Icon style={iconStyle} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Blue spacer — fills remaining nav space like HRIS */}
        <div style={{ flex: 1, minHeight: '3rem' }} />
      </nav>

      {/* ── User Footer ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '0.8rem 1.2rem' }}>
        <NavLink
          to="/cms/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            marginBottom: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FaBuilding style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              John Juan
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', margin: 0 }}>
              President
            </p>
          </div>
        </NavLink>

        {/* Logout — matches HRIS .logout-item exactly */}
        <button
          onClick={onLogoutClick}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '0.55rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}