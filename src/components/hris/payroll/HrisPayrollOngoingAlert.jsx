import { FaInfoCircle } from 'react-icons/fa';

export default function HrisPayrollOngoingAlert() {
  return (
    <div className="pr-alert">
      <FaInfoCircle className="pr-alert-icon" />
      <div>
        <h3>Ongoing Pay Period (Feb 16-28)</h3>
        <p>
          Payroll processing is locked until the cutoff period ends.
          Data shown below is provisional and accumulates daily based on attendance logs.
        </p>
      </div>
    </div>
  );
}
