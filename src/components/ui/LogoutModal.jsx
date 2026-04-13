import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <FaSignOutAlt />
          </div>
          <div>
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to log out?</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn danger" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
}
