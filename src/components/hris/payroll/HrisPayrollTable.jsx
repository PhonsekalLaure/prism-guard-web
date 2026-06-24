import { useMemo, useState } from 'react';
import {
  FaCheck,
  FaEye,
  FaListUl,
  FaMoneyBillWave,
} from 'react-icons/fa';
import EmptyState from '@components/ui/EmptyState';
import EntityAvatar from '@components/ui/EntityAvatar';
import Pagination from '@components/ui/Pagination';
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
  currentPage = 1,
  loading,
  markingRecordId = '',
  onMarkPaid,
  onPageChange,
  pageLimit = 10,
  records = [],
  run,
  totalRecords = records.length,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const totalPages = Math.ceil(totalRecords / pageLimit);
  const startIndex = (currentPage - 1) * pageLimit;
  const endIndex = startIndex + records.length;

  const title = useMemo(() => {
    if (!run) return 'Payroll Records';
    return `Payroll Records - ${formatDate(run.period_start)} to ${formatDate(run.period_end)}`;
  }, [run]);

  return (
    <div className="pr-table-container">
      <div className="pr-table-header">
        <h3><FaListUl /> {title}</h3>
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
            ) : totalRecords === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No payroll records"
                    description="Create a draft for this cutoff to calculate its payroll records."
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
                      <EntityAvatar
                        avatarUrl={row.avatar_url}
                        initials={getInitials(row.employee_name)}
                        alt={row.employee_name || 'Guard'}
                        className="pr-avatar"
                      />
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
                    <div className="pr-row-actions">
                      <button
                        className="pr-view-btn"
                        type="button"
                        onClick={() => setSelectedRow(row)}
                      >
                        <FaEye /> View
                      </button>
                      {run?.status === 'approved' && row.status === 'approved' && (
                        <button
                          className="pr-pay-btn"
                          type="button"
                          disabled={Boolean(markingRecordId)}
                          onClick={() => onMarkPaid?.(row)}
                        >
                          <FaMoneyBillWave />
                          {markingRecordId === row.id ? 'Saving...' : 'Mark Paid'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalRecords}
        label="payroll records"
        disabled={loading}
      />

      {selectedRow && (
        <PayrollBreakdownModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}
