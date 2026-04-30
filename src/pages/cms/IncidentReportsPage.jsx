import { useState } from 'react';
import IncidentReportsTopbar from '@cms-components/incident-reports/IncidentReportsTopbar';
import IncidentReportsStatCards from '@cms-components/incident-reports/IncidentReportsStatCards';
import IncidentReportsInfoBanner from '@cms-components/incident-reports/IncidentReportsInfoBanner';
import IncidentReportsFilterBar from '@cms-components/incident-reports/IncidentReportsFilterBar';
import IncidentReportsTable from '@cms-components/incident-reports/IncidentReportsTable';
import RequestReportModal from '@cms-components/incident-reports/RequestReportModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

export default function IncidentReportsPage() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const handleConfirm = () => {
    setSelectedIncident(null);
    showNotification('Report Request Submitted! You will receive the full report via email.', 'success');
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <IncidentReportsTopbar />

      <div className="cms-content">
        <IncidentReportsInfoBanner />
        <IncidentReportsStatCards />
        <IncidentReportsFilterBar />
        <IncidentReportsTable onRequestReport={(inc) => setSelectedIncident(inc)} />
      </div>

      <RequestReportModal
        isOpen={!!selectedIncident}
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
}