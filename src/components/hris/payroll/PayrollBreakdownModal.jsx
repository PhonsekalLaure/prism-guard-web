import { FaBuilding, FaCoins, FaMinusCircle, FaTimes } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import {
  buildDeductions,
  buildEarnings,
  buildEmployerContributions,
  formatDate,
  getDeductionExcess,
  getDisplayNetPay,
  getInitials,
  money,
  numeric,
} from './payrollFormatters';

export default function PayrollBreakdownModal({ row, onClose }) {
  if (!row) return null;

  const earnings = buildEarnings(row);
  const deductions = buildDeductions(row);
  const employerContributions = buildEmployerContributions(row);
  const totalEmployerContributions = employerContributions.reduce(
    (total, contribution) => total + contribution.amount,
    0
  );
  const snapshot = row.calculation_snapshot || {};
  const holidayDetails = Array.isArray(snapshot.holidays) ? snapshot.holidays : [];
  const deductionExcess = getDeductionExcess(row);

  return (
    <div
      className="pr-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="pr-modal">
        <div className="pr-modal-header">
          <div>
            <h2>Payroll Breakdown</h2>
            <p>Period: {formatDate(row.period_start)} to {formatDate(row.period_end)}</p>
          </div>
          <button className="pr-modal-close" type="button" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="pr-modal-body">
          <div className="pr-modal-emp-box">
            <div className="pr-modal-emp-left">
              <EntityAvatar
                avatarUrl={row.avatar_url}
                initials={getInitials(row.employee_name)}
                alt={row.employee_name || 'Guard'}
                className="pr-modal-avatar"
              />
              <div className="pr-modal-emp-info">
                <h3>{row.employee_name || 'Unnamed employee'}</h3>
                <p>{row.employee_position || 'Security Guard'} - {row.employee_number || 'No employee ID'}</p>
                <span>{String(row.status || 'draft').toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="pr-breakdown-section">
            <h4><FaCoins style={{ color: '#16a34a' }} /> Earnings</h4>
            <div className="pr-earnings-box">
              {earnings.map((item) => (
                <div key={item.label} className="pr-breakdown-row">
                  <span>{item.label}</span>
                  <span>{money(item.amount)}</span>
                </div>
              ))}
              <div className="pr-breakdown-total">
                <span style={{ color: '#14532d' }}>Total Gross Earnings</span>
                <span>{money(row.gross_pay)}</span>
              </div>
            </div>
          </div>

          <div className="pr-breakdown-section">
            <h4><FaMinusCircle style={{ color: '#dc2626' }} /> Deductions</h4>
            <div className="pr-deductions-box">
              {deductions.length > 0 ? deductions.map((item) => (
                <div key={item.label} className="pr-breakdown-row">
                  <span>{item.label}</span>
                  <span>{money(item.amount)}</span>
                </div>
              )) : (
                <div className="pr-breakdown-row">
                  <span>No deductions</span>
                  <span>{money(0)}</span>
                </div>
              )}
              <div className="pr-breakdown-total">
                <span style={{ color: '#7f1d1d' }}>Total Deductions</span>
                <span>{money(row.total_deductions)}</span>
              </div>
              {deductionExcess > 0 && (
                <div className="pr-deduction-excess">
                  <span>Exceeds gross pay</span>
                  <strong>{money(deductionExcess)}</strong>
                </div>
              )}
            </div>
          </div>

          <div className='pr-breakdown-section'>
            <h4><FaBuilding style={{ color: '#0369a1' }} /> Employer Contributions</h4>
            <div className='pr-employer-contributions-box'>
              {employerContributions.map((item) => (
                <div key={item.label} className='pr-breakdown-row'>
                  <span>{item.label}</span>
                  <span>{money(item.amount)}</span>
                </div>
              ))}
              <div className='pr-breakdown-total'>
                <span style={{ color: '#0c4a6e' }}>Total Employer Contributions</span>
                <span>{money(totalEmployerContributions)}</span>
              </div>
            </div>
          </div>

          <div className="pr-snapshot-grid">
            <div>
              <span>Payroll Holidays</span>
              <strong>{holidayDetails.length} day(s)</strong>
            </div>
            <div>
              <span>Paid SIL</span>
              <strong>{numeric(snapshot.paid_service_incentive_leaves?.length)} day(s)</strong>
            </div>
            <div>
              <span>Unpaid Leave</span>
              <strong>{numeric(snapshot.unpaid_leave_days)} day(s)</strong>
            </div>
            <div>
              <span>AWOL</span>
              <strong>{numeric(snapshot.awol_days)} day(s)</strong>
            </div>
            <div>
              <span>Late / Undertime</span>
              <strong>{numeric(snapshot.late_minutes) + numeric(snapshot.undertime_minutes)} min</strong>
            </div>
            <div>
              <span>Effective Daily Rate</span>
              <strong>{money(snapshot.daily_rate)}</strong>
            </div>
            <div>
              <span>Rate Basis</span>
              <strong>{snapshot.daily_rate_floor_applied ? 'Minimum floor applied' : 'Contractual rate'}</strong>
            </div>
            <div>
              <span>Contribution Basis</span>
              <strong>{money(snapshot.statutory_contribution_salary)}</strong>
            </div>
            <div>
              <span>Night Premium</span>
              <strong>
                {snapshot.night_premium_start && snapshot.night_premium_end
                  ? `${snapshot.night_premium_start.slice(0, 5)}-${snapshot.night_premium_end.slice(0, 5)}`
                  : 'Legacy policy'}
              </strong>
            </div>
          </div>

          {holidayDetails.length > 0 && (
            <div className="pr-breakdown-section">
              <h4><FaCoins style={{ color: '#ca8a04' }} /> Holiday Treatment</h4>
              <div className="pr-earnings-box">
                {holidayDetails.map((holiday) => (
                  <div
                    key={holiday.holiday_id || `${holiday.holiday_date}-${holiday.name}`}
                    className="pr-breakdown-row"
                  >
                    <span>
                      {holiday.name} ({holiday.status.replaceAll('_', ' ')})
                    </span>
                    <span>{money(holiday.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pr-net-hero">
            <div className="pr-net-hero-amount">
              <p className="label">Net Pay</p>
              <p className="value">{money(getDisplayNetPay(row))}</p>
            </div>
            <div className="pr-net-hero-date">
              <p className="label">Payment Date</p>
              <p className="value">{formatDate(row.payment_date || row.paid_at)}</p>
            </div>
          </div>

          <div className="pr-modal-actions">
            <button className="pr-modal-btn secondary" type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
