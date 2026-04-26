import { FaAddressBook, FaFileContract } from 'react-icons/fa';
import { InfoCell, fmtDate } from './ClientInfoCell';

export default function GeneralTab({ client }) {
  const contractColor =
    client.contract_status === 'Active'  ? '#16a34a' :
    client.contract_status === 'Expired' ? '#dc2626' : '#d97706';

  return (
    <div className="vc-tab-content">
      {/* Profile card */}
      <div className="vc-profile-card">
        <div className="vc-profile-left">
          <div className="vc-profile-avatar">
            {client.initials || '??'}
          </div>
          <div>
            <h3 className="vc-profile-name">{client.company}</h3>
            <p className="vc-profile-sub">{client.contact_person || 'No contact person set'}</p>
            <div className="vc-profile-meta">
              <span className={`vc-profile-badge badge-${client.status}`}>
                {client.status?.toUpperCase()}
              </span>
              <span className="vc-profile-contract" style={{ color: contractColor }}>
                Contract: {client.contract_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaAddressBook className="vc-section-icon" /> Contact Information
        </h3>
        <div className="vc-info-grid cols-2">
          <InfoCell label="Contact Person"  value={client.contact_person  || 'N/A'} />
          <InfoCell label="Email Address"   value={client.contact_email   || 'N/A'} />
          <InfoCell label="Phone Number"    value={client.phone_number    || 'N/A'} />
          <InfoCell label="Billing Address" value={client.billing_address || 'N/A'} span2 />
        </div>
      </div>

      {/* Contract Details */}
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaFileContract className="vc-section-icon" /> Contract Details
        </h3>
        <div className="vc-info-grid cols-3">
          <InfoCell label="Contract Start"  value={fmtDate(client.contract_start_date)} variant="blue" />
          <InfoCell label="Contract End"    value={fmtDate(client.contract_end_date)}   variant="blue" />
          <InfoCell label="Contract Status" value={client.contract_status || 'N/A'}     valueColor={contractColor} />
          <InfoCell label="Rate per Guard"  value={client.rate_per_guard ? `₱${Number(client.rate_per_guard).toLocaleString()}` : 'N/A'} variant="green" valueSize="xl" />
          <InfoCell label="Billing Type"    value={client.billing_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'} />
          <InfoCell label="Guard Count"     value={client.guard_count != null ? `${client.guard_count} guards` : 'N/A'} />
        </div>
      </div>
    </div>
  );
}
