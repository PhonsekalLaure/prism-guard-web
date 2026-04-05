import {
  FaExclamationTriangle, FaExclamationCircle,
  FaRegClock, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

const incidents = [
  {
    id: 1,
    bgColor: '#fef2f2',
    borderColor: '#ef4444',
    iconBg: '#fecaca',
    iconColor: '#dc2626',
    icon: FaExclamationTriangle,
    title: 'Site: FEU Tech',
    titleColor: '#1a1a1a',
    desc: '"Theft attempt intercepted. Unidentified male tried to bypass gate security. Item recovered, suspect fled."',
    descColor: '#4b5563',
    timeColor: '#dc2626',
    time: 'Reported 12 mins ago',
  },
  {
    id: 2,
    bgColor: '#fefce8',
    borderColor: '#eab308',
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    icon: FaExclamationCircle,
    title: 'Site: SM MOA',
    titleColor: '#1a1a1a',
    desc: '"Unauthorized vehicle entry detected. Driver did not present valid parking pass. Directed to proper entrance."',
    descColor: '#4b5563',
    timeColor: '#ca8a04',
    time: 'Reported 1 hour ago',
  },
];

export default function IncidentFeed() {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <h3><FaExclamationTriangle /> Critical Incident Feed (NLP Summary)</h3>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="incident-card"
            style={{ background: inc.bgColor, borderLeftColor: inc.borderColor }}
          >
            <div className="incident-icon" style={{ background: inc.iconBg, color: inc.iconColor }}>
              <inc.icon />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ color: inc.titleColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{inc.title}</h4>
              <p className="incident-desc" style={{ color: inc.descColor }}>{inc.desc}</p>
              <div className="incident-time" style={{ color: inc.timeColor }}>
                <FaRegClock />
                <span>{inc.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-pagination">
        <span className="info">Showing 1-2 of 2 incidents</span>
        <div className="page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}
