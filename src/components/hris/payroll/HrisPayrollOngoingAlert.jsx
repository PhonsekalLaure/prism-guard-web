import { FaInfoCircle } from 'react-icons/fa';

export default function HrisPayrollOngoingAlert({ run, preview }) {
  const title = preview
    ? `Preview: ${preview.period_start} to ${preview.period_end}`
    : run
      ? `Payroll run: ${run.period_start} to ${run.period_end}`
      : 'No payroll run selected';

  const message = preview
    ? 'This is a non-persisted calculation. Create a draft to save these payroll records.'
    : run
      ? `Current status is ${String(run.status || '').toUpperCase()}. Draft runs can be recalculated and approved; approved runs can be marked paid after cash release.`
      : 'Choose an existing run or preview a cutoff period to start payroll processing.';

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
