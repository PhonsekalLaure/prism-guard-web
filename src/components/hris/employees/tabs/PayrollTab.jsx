import { FaMoneyCheckAlt, FaHistory } from 'react-icons/fa';
import { InfoCell } from './EmployeeEditFields';

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function PayrollTab({ employee }) {
  const fmt = (val) => val == null ? 'N/A'
    : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title"><FaMoneyCheckAlt className="ve-section-icon" /> Payroll Information</h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Base Pay"      value={fmt(employee.base_salary)}            variant="green" valueSize="xl" />
          <InfoCell label="Pay Frequency" value={toProperCase(employee.pay_frequency)} />
        </div>
      </div>

      <div className="ve-section">
        <h3 className="ve-section-title"><FaHistory className="ve-section-icon" /> Recent Payroll History</h3>
        <div className="ve-table-wrap">
          <table className="ve-payroll-table">
            <thead>
              <tr>
                <th>Pay Period</th>
                <th className="text-right">Basic Pay</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employee.payroll_records?.length > 0 ? employee.payroll_records.map(pr => {
                const totalDeductions = (pr.statutory_deductions || 0) + (pr.cash_advance_deduction || 0) + (pr.absences_deduction || 0);
                return (
                  <tr key={pr.id}>
                    <td className="fw-600">
                      {new Date(pr.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' — '}
                      {new Date(pr.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="text-right text-green">{fmt(pr.basic_pay)}</td>
                    <td className="text-right text-red">{fmt(totalDeductions)}</td>
                    <td className="text-right fw-700">{fmt(pr.net_pay)}</td>
                    <td>
                      <span className={`ve-pay-badge ${pr.status === 'paid' ? '' : 'bg-gray-200 text-gray-700'}`}>
                        {pr.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No payroll records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
