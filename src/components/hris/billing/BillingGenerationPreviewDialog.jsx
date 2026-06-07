import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';

function formatPreviewCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function PreviewBreakdown({ item, expanded }) {
  if (!expanded) return null;

  return (
    <div className="billing-preview-item-details">
      <div className="details-header">
        <span>{item.guard_count} Guards x {formatPreviewCurrency(item.rate_per_guard)}/guard</span>
      </div>
      <table className="details-table">
        <tbody>
          {(item.line_items || []).map((lineItem, index) => (
            <tr key={`${lineItem.description || 'line'}-${index}`}>
              <td>
                <span className="li-desc">{lineItem.description}</span>
                {lineItem.detail && <span className="li-detail">{lineItem.detail}</span>}
              </td>
              <td className="li-amount">{formatPreviewCurrency(lineItem.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviewItem({
  deltaClassName,
  expandedClients,
  item,
  onExpand,
  onToggle,
  selectedClients,
  showDelta = false,
}) {
  const expanded = expandedClients.includes(item.client_id);

  return (
    <div className="billing-preview-item-wrapper">
      <div className="billing-preview-item" onClick={() => onToggle(item.client_id)}>
        <input
          type="checkbox"
          checked={selectedClients.includes(item.client_id)}
          onChange={() => {}}
        />
        <span className="client-name">{item.company}</span>
        <div className="proposed-total-wrapper">
          <span className="proposed-total">
            {formatPreviewCurrency(item.proposed_total)}
            {showDelta && (
              <span className={deltaClassName}>
                {item.delta >= 0 ? '+' : ''}{formatPreviewCurrency(item.delta)}
              </span>
            )}
          </span>
          <button
            className={`expand-details-btn ${expanded ? 'expanded' : ''}`}
            onClick={(event) => onExpand(item.client_id, event)}
            title="View Statement Breakdown"
            type="button"
          >
            v
          </button>
        </div>
      </div>
      <PreviewBreakdown item={item} expanded={expanded} />
    </div>
  );
}

function PreviewGroup({ children, className = '', count, title, warning }) {
  if (count <= 0) return null;

  return (
    <div className={`billing-preview-group ${className}`.trim()}>
      <h4>{title} ({count})</h4>
      {warning && <p className="group-warning-text">{warning}</p>}
      {children}
    </div>
  );
}

export default function BillingGenerationPreviewDialog({
  confirmGeneration,
  expandedClients,
  loading = false,
  onCancel,
  onConfirm,
  onExpandClient,
  onToggleClient,
  selectedClients,
}) {
  const preview = confirmGeneration?.preview;
  const blocked = preview?.blocked || [];
  const created = preview?.created || [];
  const refreshed = preview?.refreshed || [];
  const hasBlocked = blocked.length > 0;
  const hasRefreshed = (preview?.summary?.refreshed || 0) > 0;

  return (
    <ReportConfirmDialog
      open={Boolean(confirmGeneration)}
      title={hasBlocked ? 'Preview: Review and Confirm Statements' : 'Generate Previewed Statements?'}
      description={confirmGeneration ? `Billing statement generation preview for ${confirmGeneration.cutoff.label}.` : ''}
      confirmLabel="Apply Preview"
      loading={loading}
      tone={hasBlocked ? 'warning' : hasRefreshed ? 'warning' : 'info'}
      width="min(680px, 100%)"
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      {preview && (
        <div className="billing-preview-summary-container">
          <div className="billing-preview-stats-row">
            <div className="preview-stat-card preview-stat-card--new">
              <span className="stat-count">{preview.summary.created || 0}</span>
              <span className="stat-label">New</span>
            </div>
            <div className="preview-stat-card preview-stat-card--refreshed">
              <span className="stat-count">{preview.summary.refreshed || 0}</span>
              <span className="stat-label">Updated</span>
            </div>
            <div className="preview-stat-card preview-stat-card--skipped">
              <span className="stat-count">{preview.summary.skipped || 0}</span>
              <span className="stat-label">Skipped</span>
            </div>
            <div className="preview-stat-card preview-stat-card--blocked">
              <span className="stat-count">{preview.summary.blocked || 0}</span>
              <span className="stat-label">Blocked</span>
            </div>
          </div>

          <div className="billing-preview-total-card">
            <span className="total-label">Total Proposed Billing</span>
            <span className="total-amount">{formatPreviewCurrency(preview.summary.total_proposed || 0)}</span>
          </div>

          {(preview.holidays || []).length > 0 && (
            <div className="billing-preview-holidays-alert">
              <div className="holidays-alert-header">
                <span className="holiday-icon">Holiday</span>
                <span>Includes {preview.holidays.length} holiday{preview.holidays.length > 1 ? 's' : ''} in this period</span>
              </div>
              <div className="holidays-list">
                {preview.holidays.map((holiday) => (
                  <span key={holiday.id || `${holiday.holiday_date}-${holiday.name}`} className="holiday-tag">
                    <strong>{holiday.name}</strong> (+{formatPreviewCurrency(holiday.rate_per_guard)}/guard)
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="billing-preview-list">
            <PreviewGroup
              className="billing-preview-group--blocked"
              count={blocked.length}
              title="Blocked Paid Statements"
              warning="Checking these will force recalculation, reverting status to partial or creating client credit. Unchecked items will be skipped."
            >
              {blocked.map((item) => (
                <PreviewItem
                  key={item.client_id}
                  deltaClassName={`delta-badge ${item.delta > 0 ? 'delta-badge--danger' : 'delta-badge--success'}`}
                  expandedClients={expandedClients}
                  item={item}
                  onExpand={onExpandClient}
                  onToggle={onToggleClient}
                  selectedClients={selectedClients}
                  showDelta
                />
              ))}
            </PreviewGroup>

            <PreviewGroup count={created.length} title="New Statements">
              {created.map((item) => (
                <PreviewItem
                  key={item.client_id}
                  expandedClients={expandedClients}
                  item={item}
                  onExpand={onExpandClient}
                  onToggle={onToggleClient}
                  selectedClients={selectedClients}
                />
              ))}
            </PreviewGroup>

            <PreviewGroup count={refreshed.length} title="Updated Statements">
              {refreshed.map((item) => (
                <PreviewItem
                  key={item.client_id}
                  deltaClassName="delta-badge delta-badge--neutral"
                  expandedClients={expandedClients}
                  item={item}
                  onExpand={onExpandClient}
                  onToggle={onToggleClient}
                  selectedClients={selectedClients}
                  showDelta
                />
              ))}
            </PreviewGroup>
          </div>
        </div>
      )}
    </ReportConfirmDialog>
  );
}
