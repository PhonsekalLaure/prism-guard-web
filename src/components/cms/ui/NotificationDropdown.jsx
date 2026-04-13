import { useEffect, useRef } from 'react';
import { FaClock } from 'react-icons/fa';

const notifications = {
  today: [
    { title: 'Guard deployment updated', body: '2 guards reassigned to Gate 3', time: '30 min ago', accent: 'border-[#e6b215] bg-yellow-50/30' },
    { title: 'Payment reminder', body: 'Invoice #INV-2026-042 due in 3 days', time: '2 hours ago', accent: 'border-red-500 bg-red-50/30' },
  ],
  yesterday: [
    { title: 'Service request SR-0045 resolved', time: 'Yesterday', accent: 'border-transparent' },
    { title: 'Contract renewal reminder — 30 days', time: 'Yesterday', accent: 'border-transparent' },
  ],
};

export default function NotificationDropdown({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h4 className="font-bold text-[#093269] text-sm">Notifications</h4>
        <button className="text-xs text-[#e6b215] hover:underline font-semibold">Mark all as read</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <p className="text-xs text-gray-400 px-4 pt-3 font-semibold uppercase">Today</p>
        {notifications.today.map((n, i) => (
          <div key={i} className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${n.accent}`}>
            <p className="text-sm font-semibold text-gray-800">{n.title}</p>
            {n.body && <p className="text-xs text-gray-500 mt-1">{n.body}</p>}
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FaClock className="text-[10px]" />{n.time}</p>
          </div>
        ))}
        <p className="text-xs text-gray-400 px-4 pt-3 font-semibold uppercase">Yesterday</p>
        {notifications.yesterday.map((n, i) => (
          <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm text-gray-600">{n.title}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FaClock className="text-[10px]" />{n.time}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-gray-50 text-center">
        <button className="text-sm text-[#093269] font-semibold hover:text-[#e6b215]">View All Notifications</button>
      </div>
    </div>
  );
}