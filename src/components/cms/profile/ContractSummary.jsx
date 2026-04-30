import { FaFileContract, FaCheckCircle, FaClock, FaFileAlt, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysUntilExpiry(endDateStr) {
  if (!endDateStr) return null;
  const end = new Date(endDateStr);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function getRenewalMonth(endDateStr) {
  if (!endDateStr) return null;
  const end = new Date(endDateStr);
  end.setMonth(end.getMonth() - 3);
  return end.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <p className="cms-profile-contract__status cms-profile-contract__status--active">
        <FaCheckCircle /> Active
      </p>
    );
  }
  if (status === 'Expired') {
    return (
      <p className="cms-profile-contract__status cms-profile-contract__status--expired">
        <FaTimesCircle /> Expired
      </p>
    );
  }
  if (status === 'Upcoming') {
    return (
      <p className="cms-profile-contract__status cms-profile-contract__status--upcoming">
        <FaExclamationCircle /> Upcoming
      </p>
    );
  }
  return <p className="cms-profile-contract__status">No Contract</p>;
}

export default function ContractSummary({ profile }) {
  const daysUntilExpiry = getDaysUntilExpiry(profile?.contract_end_date);
  const renewalMonth = getRenewalMonth(profile?.contract_end_date);
  const contractStatus = profile?.contract_status;

  const contractFields = [
    {
      label: 'Contract ID',
      value: profile?.id ? `CTR-${profile.id.slice(-8).toUpperCase()}` : '—',
      valueClass: 'cms-profile-contract__id',
    },
    {
      label: 'Start Date',
      value: formatDate(profile?.contract_start_date),
      valueClass: '',
    },
    {
      label: 'End Date',
      value: formatDate(profile?.contract_end_date),
      valueClass: '',
    },
    {
      label: 'Status',
      value: null,
      isStatus: true,
    },
  ];

  const showRenewalNotice =
    contractStatus === 'Active' &&
    daysUntilExpiry !== null &&
    daysUntilExpiry > 0 &&
    daysUntilExpiry <= 365;

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
                <StatusBadge status={contractStatus} />
              ) : (
                <p className={`cms-profile-contract__cell-value ${valueClass}`}>{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Renewal Notice */}
        {showRenewalNotice && (
          <div className="cms-profile-contract__renewal-notice">
            <FaClock className="cms-profile-contract__renewal-icon" />
            <p className="cms-profile-contract__renewal-text">
              <strong>Renewal Notice:</strong> Contract expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.
              {renewalMonth && ` Renewal discussions should begin by ${renewalMonth}.`}
            </p>
          </div>
        )}

        {/* View Full Contract */}
        {profile?.contract_url ? (
          <a
            href={profile.contract_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cms-profile-contract__view-btn"
          >
            <FaFileAlt /> View Full Contract
          </a>
        ) : (
          <button className="cms-profile-contract__view-btn" disabled>
            <FaFileAlt /> No Contract on File
          </button>
        )}
      </div>
    </div>
  );
}