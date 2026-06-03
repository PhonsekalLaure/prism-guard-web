import { useMemo, useState } from 'react';
import {
  FaCheck,
  FaEye,
  FaListUl,
} from 'react-icons/fa';
import EmptyState from '@components/ui/EmptyState';
import { TableSkeletonRows } from '@components/ui/Skeleton';
import PayrollBreakdownModal from './PayrollBreakdownModal';
import {
  formatDate,
  formatHours,
  getDisplayNetPay,
  getInitials,
  getStatusClass,
  money,
  numeric,
} from './payrollFormatters';

export default function HrisPayrollTable({
  loading,
  records = [],
  run,
  preview,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const title = useMemo(() => {
    const source = preview || run;
    if (!source) return 'Payroll Records';
    return `Payroll Records - ${formatDate(source.period_start)} to ${formatDate(source.period_end)}`;
  }, [preview, run]);

  return (
    <div className="pr-table-container">
      <div className="pr-table-header">
        <h3><FaListUl /> {title}</h3>
        {preview && <span className="pr-preview-pill">Preview only</span>}
      </div>

      <div className="pr-table-wrap">
        <table className="pr-table">
          <thead>
            <tr>
              <th className="left">Employee</th>
              <th className="left">Position</th>
              <th className="right">Worked Hours</th>
              <th className="right">Gross Pay</th>
              <th className="right">Deductions</th>
              <th className="right">Net Pay</th>
              <th className="left">Status</th>
              <th className="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows rows={5} columns={8} />
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No payroll records"
                    description="Preview a cutoff period or select a saved payroll run to see records here."
                  />
                </td>
              </tr>
            ) : records.map((row) => {
              const status = row.status || run?.status || 'draft';
              const badgeClass = getStatusClass(status);
              const leaveDays = numeric(row.calculation_snapshot?.unpaid_leave_days);
              const awolDays = numeric(row.calculation_snapshot?.awol_days);

              return (
                <tr
                  key={row.id || row.employee_id}
                  className={badgeClass === 'paid' ? 'paid-row' : ''}
                  onClick={() => setSelectedRow(row)}
                >
                  <td>
                    <div className="pr-emp-cell">
                      <div className="pr-avatar">{getInitials(row.employee_name)}</div>
                      <div>
                        <p className="pr-emp-name">{row.employee_name || 'Unnamed employee'}</p>
                        <p className="pr-emp-id">{row.employee_number || 'No employee ID'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="pr-pos-name">{row.employee_position || 'Security Guard'}</p>
                    <p className="pr-pos-loc">12-hour guard shift</p>
                  </td>
                  <td className="right">
                    <p className="pr-days-main">{formatHours(numeric(row.regular_hours) + numeric(row.overtime_hours))}</p>
                    <p className="pr-days-sub normal">{formatHours(row.overtime_hours)} OT hrs</p>
                  </td>
                  <td className="right">
                    <p className="pr-gross-main">{money(row.gross_pay)}</p>
                    <p className="pr-gross-sub">{money(row.overtime_pay)} OT + {money(row.night_differential_pay)} ND</p>
                  </td>
                  <td className="right">
                    <p className="pr-ded-main">{money(row.total_deductions)}</p>
                    <p className={`pr-days-sub ${leaveDays || awolDays ? 'absent' : 'normal'}`}>
                      {leaveDays || awolDays ? `${leaveDays} unpaid leave, ${awolDays} AWOL` : 'Statutory/cash advance if any'}
                    </p>
                  </td>
                  <td className="right">
                    <p className={`pr-net-pay ${badgeClass === 'paid' ? 'paid' : ''}`}>{money(getDisplayNetPay(row))}</p>
                  </td>
                  <td>
                    <span className={`pr-badge ${badgeClass}`}>
                      {badgeClass === 'paid' && <FaCheck />}
                      {String(status).toUpperCase()}
                    </span>
                  </td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <button
                      className="pr-view-btn"
                      type="button"
                      onClick={() => setSelectedRow(row)}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pr-pagination">
        <p className="pr-pagination-text">Showing {records.length} payroll record{records.length === 1 ? '' : 's'}</p>
      </div>

      {selectedRow && (
        <PayrollBreakdownModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}
