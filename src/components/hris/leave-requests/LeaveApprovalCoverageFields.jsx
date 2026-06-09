import { FaFileUpload, FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

function ReplacementGuardSkeletonList() {
  return (
    <div className="hlr-replacement-list">
      <SkeletonList count={3}>{(index) => (
        <div key={index} className="hlr-replacement-card">
          <SkeletonBlock className="hlr-replacement-avatar" />
          <div className="hlr-replacement-info">
            <div className="hlr-replacement-row">
              <SkeletonBlock height="0.9rem" width={150} />
              <SkeletonBlock height={22} width={84} radius="999px" />
            </div>
            <SkeletonBlock height="0.75rem" width={180} style={{ marginTop: '0.3rem' }} />
          </div>
          <SkeletonBlock height="0.8rem" width={72} />
        </div>
      )}</SkeletonList>
    </div>
  );
}

export default function LeaveApprovalCoverageFields({
  deploymentOrderFile,
  onDeploymentOrderFileChange,
  onRelieverSelect,
  replacementGuards = [],
  replacementLoading = false,
  selectedRelieverId = '',
}) {
  return (
    <>
      <div className="hlr-approval-heading">
        <FaUserShield />
        <div>
          <p>Replacement Guard</p>
          <span>Relievers are listed first, then floating guards, then guards on days off.</span>
        </div>
      </div>

      {replacementLoading ? (
        <ReplacementGuardSkeletonList />
      ) : replacementGuards.length === 0 ? (
        <div className="hlr-replacement-empty">
          No replacement guards match this leave request and site location.
        </div>
      ) : (
        <div className="hlr-replacement-list">
          {replacementGuards.map((guard) => {
            const isSelected = selectedRelieverId === guard.id;
            return (
              <button
                key={guard.id}
                type="button"
                className={`hlr-replacement-card${isSelected ? ' selected' : ''}`}
                onClick={() => onRelieverSelect(guard.id)}
              >
                <div className="hlr-replacement-avatar">
                  {(guard.name || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="hlr-replacement-info">
                  <div className="hlr-replacement-row">
                    <p>{guard.name}</p>
                    <span className={`hlr-replacement-chip ${guard.availability_type}`}>
                      {guard.availability_label}
                    </span>
                  </div>
                  <span>{guard.employee_id_number} - {guard.position}</span>
                </div>
                <div className="hlr-replacement-distance">
                  <FaMapMarkerAlt />
                  {guard.distance_km == null ? 'No coords' : `${guard.distance_km} km`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div>
        <span className="hlr-modal-section-label">Temporary Deployment Order</span>
        <label className={`hlr-upload-zone${deploymentOrderFile ? ' has-file' : ''}`}>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(event) => onDeploymentOrderFileChange(event.target.files?.[0] || null)}
          />
          <FaFileUpload />
          <span>{deploymentOrderFile?.name || 'Upload temporary deployment order'}</span>
        </label>
      </div>
    </>
  );
}
