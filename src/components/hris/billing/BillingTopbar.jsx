import { FaBars, FaFileInvoice } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import ReportActionButton from '@components/ui/ReportActionButton';

const ALL_CUTOFFS_KEY = 'all';

export default function BillingTopbar({
  cutoffOptions = [],
  selectedCutoffKey = '',
  onCutoffChange,
  onGenerate,
  generating = false,
}) {
  const { toggleSidebar } = useOutletContext();
  const selectedCutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);

  return (
    <header className="dashboard-topbar billing-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Billing &amp; Payments</h2>
            <p className="subtitle">Track client payment statuses and billing records</p>
          </div>
        </div>

        <div className="billing-topbar-actions">
          <label className="billing-cutoff-label">
            <span>Billing Cutoff</span>
            <select
              className="billing-period-select"
              value={selectedCutoffKey}
              onChange={(event) => onCutoffChange?.(event.target.value)}
              aria-label="Billing cutoff"
            >
              <option value={ALL_CUTOFFS_KEY}>All cutoffs</option>
              {cutoffOptions.map((option) => (
                <option key={option.key} value={option.key} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <ReportActionButton
            className="btn-generate-soa"
            label="Generate Statements"
            loadingLabel="Generating..."
            icon={FaFileInvoice}
            loading={generating}
            disabled={!selectedCutoff || selectedCutoff.disabled || selectedCutoffKey === ALL_CUTOFFS_KEY}
            variant="primary"
            onClick={onGenerate}
          />
        </div>
      </div>
    </header>
  );
}
