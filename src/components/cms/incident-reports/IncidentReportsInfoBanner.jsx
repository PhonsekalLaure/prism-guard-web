import { FaInfoCircle } from 'react-icons/fa';

export default function IncidentReportsInfoBanner() {
  return (
    <div className="cir-info-banner">
      <div className="cir-info-banner__icon">
        <FaInfoCircle />
      </div>
      <div>
        <p className="cir-info-banner__title">Detailed Reports Available Upon Request</p>
        <p className="cir-info-banner__body">
          For full incident documentation, click &ldquo;Request Full Report&rdquo; on any incident.
          The security team will prepare and send the complete report within 24–48 hours.
        </p>
      </div>
    </div>
  );
}