import { FaBars, FaFileInvoice } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

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
            <span>Cutoff to Generate</span>
            <select
              className="billing-period-select"
              value={selectedCutoffKey}
              onChange={(event) => onCutoffChange?.(event.target.value)}
              aria-label="Cutoff to generate"
            >
              {cutoffOptions.map((option) => (
                <option key={option.key} value={option.key} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn-generate-soa"
            type="button"
            onClick={onGenerate}
            disabled={generating || !selectedCutoff || selectedCutoff.disabled}
          >
            <FaFileInvoice />
            {generating ? 'Generating...' : 'Generate Statements'}
          </button>
        </div>
      </div>
    </header>
  );
}
