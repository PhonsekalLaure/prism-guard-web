import { useState } from 'react';
import { FaDownload, FaCalculator, FaLock, FaCheck, FaSpinner } from 'react-icons/fa';

const periods = [
  'Current Period: Feb 1-15, 2026',
  'Previous Period: Jan 16-31, 2026',
  'Jan 1-15, 2026',
];

export default function HrisPayrollTopbar({ mode, onModeChange }) {
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleProcess = () => {
    if (mode === 'ongoing') return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 2000);
  };

  return (
    <header className="pr-topbar">
      <div className="pr-title-group">
        <h2>Payroll Management</h2>
        <p>Process and manage employee compensation</p>
      </div>

      <div className="pr-topbar-right">
        {/* Finalized / Ongoing toggle */}
        <div className="pr-period-toggle">
          <button
            className={`pr-toggle-btn ${mode === 'finalized' ? 'active' : ''}`}
            onClick={() => onModeChange('finalized')}
          >
            Finalized
          </button>
          <button
            className={`pr-toggle-btn ${mode === 'ongoing' ? 'active' : ''}`}
            onClick={() => onModeChange('ongoing')}
          >
            Ongoing
          </button>
        </div>

        {/* Period selector */}
        <select className="pr-period-select">
          {periods.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        {/* Export */}
        <button className="pr-export-btn">
          <FaDownload /> Export Payroll
        </button>

        {/* Process Payroll */}
        <button
          className={`pr-process-btn ${processed ? 'success' : ''}`}
          onClick={handleProcess}
          disabled={processing || mode === 'ongoing'}
        >
          {mode === 'ongoing' ? (
            <><FaLock /> Processing Locked</>
          ) : processing ? (
            <><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
          ) : processed ? (
            <><FaCheck /> Processed</>
          ) : (
            <><FaCalculator /> Process Payroll</>
          )}
        </button>
      </div>
    </header>
  );
}
