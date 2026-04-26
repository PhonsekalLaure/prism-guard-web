import { FaInfoCircle } from 'react-icons/fa';

export default function HrisCashAdvanceAlert() {
  return (
    <div className="ca-alert">
      <FaInfoCircle className="ca-alert-icon" />
      <div>
        <h3>Cash Advance Integration</h3>
        <p>
          Approved cash advances are automatically deducted from employee payroll.
          Disbursement must be marked as "Released" once physical cash is handed to the employee.
          Advances are tracked until fully settled.
        </p>
      </div>
    </div>
  );
}
