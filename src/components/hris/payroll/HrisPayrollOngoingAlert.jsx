import { FaInfoCircle } from 'react-icons/fa';

export default function HrisPayrollOngoingAlert({ run }) {
  const title = run
    ? `Payroll run: ${run.period_start} to ${run.period_end}`
    : 'No payroll run created';

  const message = run
    ? `Current status is ${String(run.status || '').toUpperCase()}. Draft runs can be recalculated and approved; approved guard records are marked paid individually after cash release.`
    : 'Create a draft to calculate and save payroll records for this cutoff.';

  return (
    <div className="pr-alert">
      <FaInfoCircle className="pr-alert-icon" />
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}
