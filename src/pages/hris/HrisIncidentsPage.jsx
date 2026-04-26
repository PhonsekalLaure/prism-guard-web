import HrisIncidentsTopbar from '@hris-components/incidents/HrisIncidentsTopbar';
import HrisIncidentsStatCards from '@hris-components/incidents/HrisIncidentsStatCards';
import HrisIncidentsFilterBar from '@hris-components/incidents/HrisIncidentsFilterBar';
import HrisIncidentsFeed from '@hris-components/incidents/HrisIncidentsFeed';
import '../../styles/hris/HrisIncidents.css';

export default function HrisIncidentsPage() {
  return (
    <>
      <HrisIncidentsTopbar />

      <div className="dashboard-content">
        <HrisIncidentsStatCards />
        <HrisIncidentsFilterBar />
        <HrisIncidentsFeed />
      </div>
    </>
  );
}
