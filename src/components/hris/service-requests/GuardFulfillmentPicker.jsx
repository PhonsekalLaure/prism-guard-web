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
      <div className="sr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sr-modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className="sr-modal-body">
          <div className="sr-description-box">
            <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>{label}</p>
            <select
              className="sr-filter-select"
              value={selectedEmployeeId}
              onChange={(e) => onSelect(e.target.value)}
              disabled={loading}
            >
              <option value="">Select deployable guard...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.employee_id_number}{emp.distance_km != null ? ` - ${emp.distance_km} km` : ''}
                </option>
              ))}
            </select>
            {!loading && employees.length === 0 && (
              <p className="sr-description-text" style={{ marginTop: '0.75rem' }}>
                No deployable guards are currently available.
              </p>
            )}
          </div>
          <div className="sr-modal-actions">
            <button className="sr-modal-btn gray" onClick={onCancel} disabled={loading}>Cancel</button>
            <button className="sr-modal-btn blue" onClick={onContinue} disabled={loading || !selectedEmployeeId}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
