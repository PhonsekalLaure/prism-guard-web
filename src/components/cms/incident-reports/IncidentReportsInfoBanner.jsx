import { FaInfoCircle } from 'react-icons/fa';

export default function IncidentReportsInfoBanner() {
  return (
    <div className="ir-info-banner">
      <div className="ir-info-banner__icon">
        <FaInfoCircle />
      </div>
      <div>
        <p className="ir-info-banner__title">Detailed Reports Available Upon Request</p>
        <p className="ir-info-banner__body">
          For full incident documentation, click &ldquo;Request Full Report&rdquo; on any incident.
          The security team will prepare and send the complete report within 24-48 hours.
        </p>
      </div>
    </div>
  );
}