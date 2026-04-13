import { Link } from 'react-router-dom';
import { FaBolt, FaArrowRight, FaHeadset, FaDownload, FaCreditCard } from 'react-icons/fa';

const actions = [
  { label: 'View All Deployed Guards', to: '/cms/deployed-guards', icon: FaArrowRight, accent: false },
  { label: 'Submit Inquiry / Request', to: '/cms/service-requests', icon: FaHeadset, accent: false },
  { label: 'Download Reports', to: '/cms/reports', icon: FaDownload, accent: false },
  { label: 'View Payment Billings', to: '/cms/billing', icon: FaCreditCard, accent: true },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl shadow-lg p-6 text-white" style={{ background: 'linear-gradient(135deg, #093269 0%, #0a4080 100%)' }}>
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <FaBolt className="text-[#e6b215]" />
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className={`flex justify-between items-center w-full p-3 rounded-lg text-sm font-semibold transition ${
              a.accent
                ? 'bg-[#e6b215] hover:bg-[#d4a012] text-[#093269]'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <span>{a.label}</span>
            <a.icon className="text-sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}