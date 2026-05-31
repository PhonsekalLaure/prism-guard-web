import { FaUserShield, FaMapMarkerAlt, FaTimes, FaArrowRight, FaIdCard } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';

export default function GuardFulfillmentPicker({
  isOpen,
  employees,
  selectedEmployeeId,
  loading,
  title = 'Select Additional Guard',
  subtitle = 'Choose the guard to deploy for this request',
  label = 'Available Guard',
  onSelect,
  onCancel,
  onContinue,
}) {
  if (!isOpen) return null;

  return (
    <div className="sr-modal-overlay" onClick={onCancel}>
      <div className="sr-modal-content sr-guard-picker-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="sr-guard-picker-header-icon">
              <FaUserShield />
            </div>
            <div>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>
          <button className="sr-modal-close" onClick={onCancel} type="button" aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">

          {/* Section label */}
          <div className="sr-guard-picker-section-label">
            <FaIdCard className="sr-guard-picker-section-icon" />
            {label}
            {employees.length > 0 && (
              <span className="sr-guard-picker-count">{employees.length} available</span>
            )}
          </div>

          {/* States */}
          {loading ? (
            <div className="sr-guard-picker-list" style={{ pointerEvents: 'none' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sr-guard-card" style={{ cursor: 'default' }}>
                  <div className="dsk-avatar" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                  <div className="sr-guard-card-info">
                    <div className="dsk-line md" style={{ marginBottom: '0.35rem' }} />
                    <div className="dsk-line sm" />
                  </div>
                  <div className="sr-guard-card-right">
                    <div className="dsk-btn" style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : employees.length === 0 ? (
            <div className="sr-guard-picker-empty">
              <div className="sr-guard-picker-empty-icon">
                <FaUserShield />
              </div>
              <p className="sr-guard-picker-empty-title">No Guards Available</p>
              <p className="sr-guard-picker-empty-sub">
                No deployable guards are currently available for this site.
              </p>
            </div>
          ) : (
            <div className="sr-guard-picker-list">
              {employees.map((emp) => {
                const isSelected = selectedEmployeeId === emp.id;
                const initials = (emp.name || 'G')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={emp.id}
                    type="button"
                    className={`sr-guard-card${isSelected ? ' sr-guard-card--selected' : ''}`}
                    onClick={() => onSelect(emp.id)}
                  >
                    <EntityAvatar
                      avatarUrl={emp.avatarUrl || emp.avatar_url}
                      initials={initials}
                      className="sr-guard-card-avatar"
                      alt={emp.name || initials}
                    />

                    <div className="sr-guard-card-info">
                      <p className="sr-guard-card-name">{emp.name}</p>
                      <p className="sr-guard-card-id">{emp.employee_id_number}</p>
                    </div>

                    <div className="sr-guard-card-right">
                      {emp.distance_km != null && (
                        <span className="sr-guard-card-distance">
                          <FaMapMarkerAlt /> {emp.distance_km} km
                        </span>
                      )}
                      <div className={`sr-guard-card-radio${isSelected ? ' sr-guard-card-radio--active' : ''}`}>
                        {isSelected && <div className="sr-guard-card-radio-dot" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="sr-modal-actions">
            <button
              type="button"
              className="sr-modal-btn gray"
              onClick={onCancel}
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="button"
              className="sr-modal-btn blue"
              onClick={onContinue}
              disabled={loading || !selectedEmployeeId}
            >
              Continue <FaArrowRight />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
