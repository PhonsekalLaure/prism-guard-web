import { FaFileContract, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

const contractFields = [
  { label: 'Contract ID', value: 'CTR-2024-001', valueClass: 'cms-profile-contract__id' },
  { label: 'Start Date', value: 'Jan 15, 2024', valueClass: '' },
  { label: 'End Date', value: 'Dec 31, 2026', valueClass: '' },
  {
    label: 'Status',
    value: null,
    isStatus: true,
  },
];

export default function ContractSummary() {
  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <h3 className="cms-profile-section__title">
          <FaFileContract className="cms-profile-section__icon" /> Contract Summary
        </h3>

        {/* Contract Fields Grid */}
        <div className="cms-profile-contract__grid">
          {contractFields.map(({ label, value, valueClass, isStatus }) => (
            <div key={label} className="cms-profile-contract__cell">
              <p className="cms-profile-contract__cell-label">{label}</p>
              {isStatus ? (
                <p className="cms-profile-contract__status">
                  <FaCheckCircle />
                  Active
                </p>
              ) : (
                <p className={`cms-profile-contract__cell-value ${valueClass}`}>{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Renewal Notice */}
        <div className="cms-profile-contract__renewal-notice">
          <FaClock className="cms-profile-contract__renewal-icon" />
          <p className="cms-profile-contract__renewal-text">
            <strong>Renewal Notice:</strong> Contract expires in 320 days. Renewal discussions
            should begin by Oct 2026.
          </p>
        </div>

        {/* View Full Contract */}
        <button className="cms-profile-contract__view-btn">
          <FaFileAlt />
          View Full Contract
        </button>
      </div>
    </div>
  );
}