import { useState } from 'react';
import DeployedGuardsTopbar from '@cms-components/deployed-guards/DeployedGuardsTopbar';
import DeployedGuardsStatCards from '@cms-components/deployed-guards/DeployedGuardsStatCards';
import DeployedGuardsFilterBar from '@cms-components/deployed-guards/DeployedGuardsFilterBar';
import GuardRosterTable from '@cms-components/deployed-guards/GuardRosterTable';
import GuardDetailModal from '@cms-components/deployed-guards/GuardDetailModal';

export default function DeployedGuardsPage() {
  const [selectedGuard, setSelectedGuard] = useState(null);

  return (
    <>
      <DeployedGuardsTopbar />

      <div className="cms-content">
        <DeployedGuardsStatCards />
        <DeployedGuardsFilterBar />
        <GuardRosterTable onViewGuard={(guard) => setSelectedGuard(guard)} />
      </div>

      <GuardDetailModal
        isOpen={!!selectedGuard}
        guard={selectedGuard}
        onClose={() => setSelectedGuard(null)}
      />
    </>
  );
}