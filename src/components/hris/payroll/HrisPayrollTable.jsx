import { useState } from 'react';
import {
  FaListUl, FaDownload, FaEye, FaChevronLeft, FaChevronRight,
  FaTimes, FaPrint, FaCheck, FaEnvelope, FaCoins, FaMinusCircle,
} from 'react-icons/fa';

const payrollData = [
  {
    id: 1,
    initials: 'JC',
    name: 'Juan Cruz',
    empId: 'PRISM-2024-001',
    position: 'Security Officer I',
    location: 'SM Mall of Asia',
    daysWorked: '15',
    daysSub: 'Full period',
    daysSubClass: 'normal',
    grossMain: '₱9,500.00',
    grossSub: '+ ₱1,200 OT',
    dedMain: '₱1,850.00',
    dedSub: 'SSS, PhilHealth, etc.',
    netPay: '₱8,850.00',
    netPayClass: '',
    status: 'READY',
    statusClass: 'ready',
    rowClass: '',
    earnings: [
      { label: 'Base Pay (15 days)', amount: '₱7,500.00' },
      { label: 'Overtime Pay (10 hours)', amount: '₱1,200.00' },
      { label: 'Night Differential', amount: '₱800.00' },
    ],
    earningsTotal: '₱9,500.00',
    deductions: [
      { label: 'SSS Contribution', amount: '₱450.00' },
      { label: 'PhilHealth', amount: '₱300.00' },
      { label: 'Pag-IBIG', amount: '₱200.00' },
      { label: 'Withholding Tax', amount: '₱500.00' },
      { label: 'Cash Bond', amount: '₱200.00' },
      { label: 'Late Deduction', amount: '₱200.00' },
    ],
    deductionsTotal: '₱1,850.00',
    netHero: '₱8,850.00',
    payDate: 'February 25, 2026',
    period: 'February 1-15, 2026',
  },
  {
    id: 2,
    initials: 'RR',
    name: 'Ronn Rosarito',
    empId: 'PRISM-2024-002',
    position: 'Security Guard',
    location: 'FEU Institute of Tech',
    daysWorked: '13',
    daysSub: '2 days leave',
    daysSubClass: 'leave',
    grossMain: '₱7,800.00',
    grossSub: '+ ₱1,200 OT',
    dedMain: '₱1,450.00',
    dedSub: 'SSS, PhilHealth, etc.',
    netPay: '₱6,350.00',
    netPayClass: '',
    status: 'PROCESSING',
    statusClass: 'processing',
    rowClass: '',
    earnings: [
      { label: 'Base Pay (13 days)', amount: '₱6,600.00' },
      { label: 'Overtime Pay', amount: '₱1,200.00' },
    ],
    earningsTotal: '₱7,800.00',
    deductions: [
      { label: 'SSS Contribution', amount: '₱400.00' },
      { label: 'PhilHealth', amount: '₱250.00' },
      { label: 'Pag-IBIG', amount: '₱200.00' },
      { label: 'Withholding Tax', amount: '₱400.00' },
      { label: 'Leave Deduction', amount: '₱200.00' },
    ],
    deductionsTotal: '₱1,450.00',
    netHero: '₱6,350.00',
    payDate: 'February 25, 2026',
    period: 'February 1-15, 2026',
  },
  {
    id: 3,
    initials: 'QM',
    name: 'Quervie Manrique',
    empId: 'PRISM-2024-003',
    position: 'Lady Guard',
    location: 'SM North Edsa',
    daysWorked: '15',
    daysSub: 'Full period',
    daysSubClass: 'normal',
    grossMain: '₱8,200.00',
    grossSub: 'Base only',
    dedMain: '₱1,550.00',
    dedSub: 'SSS, PhilHealth, etc.',
    netPay: '₱6,650.00',
    netPayClass: 'paid',
    status: 'PAID',
    statusClass: 'paid',
    rowClass: 'paid-row',
    earnings: [
      { label: 'Base Pay (15 days)', amount: '₱8,200.00' },
    ],
    earningsTotal: '₱8,200.00',
    deductions: [
      { label: 'SSS Contribution', amount: '₱450.00' },
      { label: 'PhilHealth', amount: '₱300.00' },
      { label: 'Pag-IBIG', amount: '₱200.00' },
      { label: 'Withholding Tax', amount: '₱600.00' },
    ],
    deductionsTotal: '₱1,550.00',
    netHero: '₱6,650.00',
    payDate: 'February 25, 2026',
    period: 'February 1-15, 2026',
  },
  {
    id: 4,
    initials: 'CA',
    name: 'Christabelle Acedillo',
    empId: 'PRISM-2024-004',
    position: 'Security Officer II',
    location: 'FEU Institute of Tech',
    daysWorked: '14',
    daysSub: '1 day absent',
    daysSubClass: 'absent',
    grossMain: '₱9,800.00',
    grossSub: '+ ₱800 ND',
    dedMain: '₱2,150.00',
    dedSub: 'Inc. cash advance',
    netPay: '₱7,650.00',
    netPayClass: '',
    status: 'READY',
    statusClass: 'ready',
    rowClass: '',
    earnings: [
      { label: 'Base Pay (14 days)', amount: '₱9,000.00' },
      { label: 'Night Differential', amount: '₱800.00' },
    ],
    earningsTotal: '₱9,800.00',
    deductions: [
      { label: 'SSS Contribution', amount: '₱450.00' },
      { label: 'PhilHealth', amount: '₱300.00' },
      { label: 'Pag-IBIG', amount: '₱200.00' },
      { label: 'Withholding Tax', amount: '₱700.00' },
      { label: 'Cash Advance (CA-046)', amount: '₱500.00' },
    ],
    deductionsTotal: '₱2,150.00',
    netHero: '₱7,650.00',
    payDate: 'February 25, 2026',
    period: 'February 1-15, 2026',
  },
  {
    id: 5,
    initials: 'RG',
    name: 'Richielle Gutierrez',
    empId: 'PRISM-2024-005',
    position: 'Security Guard',
    location: 'SM Mall of Asia',
    daysWorked: '15',
    daysSub: 'Full period',
    daysSubClass: 'normal',
    grossMain: '₱10,500.00',
    grossSub: '+ ₱2,000 OT + ND',
    dedMain: '₱1,950.00',
    dedSub: 'SSS, PhilHealth, etc.',
    netPay: '₱8,550.00',
    netPayClass: '',
    status: 'READY',
    statusClass: 'ready',
    rowClass: '',
    earnings: [
      { label: 'Base Pay (15 days)', amount: '₱7,500.00' },
      { label: 'Overtime Pay (18 hours)', amount: '₱2,000.00' },
      { label: 'Night Differential', amount: '₱1,000.00' },
    ],
    earningsTotal: '₱10,500.00',
    deductions: [
      { label: 'SSS Contribution', amount: '₱450.00' },
      { label: 'PhilHealth', amount: '₱300.00' },
      { label: 'Pag-IBIG', amount: '₱200.00' },
      { label: 'Withholding Tax', amount: '₱1,000.00' },
    ],
    deductionsTotal: '₱1,950.00',
    netHero: '₱8,550.00',
    payDate: 'February 25, 2026',
    period: 'February 1-15, 2026',
  },
];

function PayrollModal({ row, onClose }) {
  if (!row) return null;

  return (
    <div
      className="pr-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pr-modal">
        {/* Gradient header */}
        <div className="pr-modal-header">
          <div>
            <h2>Payroll Breakdown</h2>
            <p>Period: {row.period}</p>
          </div>
          <button className="pr-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="pr-modal-body">
          {/* Employee info */}
          <div className="pr-modal-emp-box">
            <div className="pr-modal-emp-left">
              <div className="pr-modal-avatar">{row.initials}</div>
              <div className="pr-modal-emp-info">
                <h3>{row.name}</h3>
                <p>{row.position} • {row.empId}</p>
                <span>{row.location}</span>
              </div>
            </div>
            <button className="pr-print-btn">
              <FaPrint /> Print Payslip
            </button>
          </div>

          {/* Earnings */}
          <div className="pr-breakdown-section">
            <h4><FaCoins style={{ color: '#16a34a' }} /> Earnings</h4>
            <div className="pr-earnings-box">
              {row.earnings.map((e, i) => (
                <div key={i} className="pr-breakdown-row">
                  <span>{e.label}</span>
                  <span>{e.amount}</span>
                </div>
              ))}
              <div className="pr-breakdown-total">
                <span style={{ color: '#14532d' }}>Total Gross Earnings</span>
                <span>{row.earningsTotal}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="pr-breakdown-section">
            <h4><FaMinusCircle style={{ color: '#dc2626' }} /> Deductions</h4>
            <div className="pr-deductions-box">
              {row.deductions.map((d, i) => (
                <div key={i} className="pr-breakdown-row">
                  <span>{d.label}</span>
                  <span>{d.amount}</span>
                </div>
              ))}
              <div className="pr-breakdown-total">
                <span style={{ color: '#7f1d1d' }}>Total Deductions</span>
                <span>{row.deductionsTotal}</span>
              </div>
            </div>
          </div>

          {/* Net Pay hero */}
          <div className="pr-net-hero">
            <div className="pr-net-hero-amount">
              <p className="label">Net Pay (Take Home)</p>
              <p className="value">{row.netHero}</p>
            </div>
            <div className="pr-net-hero-date">
              <p className="label">Payment Date</p>
              <p className="value">{row.payDate}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pr-modal-actions">
            {row.status !== 'PAID' && (
              <button className="pr-modal-btn paid" onClick={onClose}>
                <FaCheck /> Mark as Paid
              </button>
            )}
            <button className="pr-modal-btn email" onClick={onClose}>
              <FaEnvelope /> Send Payslip via Email
            </button>
            <button className="pr-modal-btn secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisPayrollTable({ mode }) {
  const [selectedRow, setSelectedRow] = useState(null);

  // When in "ongoing" mode, override status to ACCUMULATING
  const displayData = payrollData.map((row) =>
    mode === 'ongoing'
      ? { ...row, status: 'ACCUMULATING', statusClass: 'accumulating' }
      : row
  );

  return (
    <div className="pr-table-container">
      <div className="pr-table-header">
        <h3><FaListUl /> Payroll Records — February 1-15, 2026</h3>
        <button className="pr-export-slips-btn">
          <FaDownload /> Export Payslips
        </button>
      </div>

      <div className="pr-table-wrap">
        <table className="pr-table">
          <thead>
            <tr>
              <th className="left">Employee</th>
              <th className="left">Position</th>
              <th className="right">Days Worked</th>
              <th className="right">Gross Pay</th>
              <th className="right">Deductions</th>
              <th className="right">Net Pay</th>
              <th className="left">Status</th>
              <th className="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => (
              <tr
                key={row.id}
                className={row.rowClass}
                onClick={() => setSelectedRow(row)}
              >
                {/* Employee */}
                <td>
                  <div className="pr-emp-cell">
                    <div className="pr-avatar">{row.initials}</div>
                    <div>
                      <p className="pr-emp-name">{row.name}</p>
                      <p className="pr-emp-id">{row.empId}</p>
                    </div>
                  </div>
                </td>

                {/* Position */}
                <td>
                  <p className="pr-pos-name">{row.position}</p>
                  <p className="pr-pos-loc">{row.location}</p>
                </td>

                {/* Days worked */}
                <td className="right">
                  <p className="pr-days-main">{row.daysWorked}</p>
                  <p className={`pr-days-sub ${row.daysSubClass}`}>{row.daysSub}</p>
                </td>

                {/* Gross pay */}
                <td className="right">
                  <p className="pr-gross-main">{row.grossMain}</p>
                  <p className="pr-gross-sub">{row.grossSub}</p>
                </td>

                {/* Deductions */}
                <td className="right">
                  <p className="pr-ded-main">{row.dedMain}</p>
                  <p className="pr-ded-sub">{row.dedSub}</p>
                </td>

                {/* Net Pay */}
                <td className="right">
                  <p className={`pr-net-pay ${row.netPayClass}`}>{row.netPay}</p>
                </td>

                {/* Status */}
                <td>
                  <span className={`pr-badge ${row.statusClass}`}>
                    {row.statusClass === 'paid' && <FaCheck />}
                    {row.status}
                  </span>
                </td>

                {/* Actions */}
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    className="pr-view-btn"
                    onClick={() => setSelectedRow(row)}
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pr-pagination">
        <p className="pr-pagination-text">Showing 1-8 of 126 records</p>
        <div className="pr-pagination-controls">
          <button className="pr-page-btn" disabled><FaChevronLeft /></button>
          <button className="pr-page-btn active">1</button>
          <button className="pr-page-btn">2</button>
          <button className="pr-page-btn">3</button>
          <button className="pr-page-btn"><FaChevronRight /></button>
        </div>
      </div>

      {/* Breakdown Modal */}
      {selectedRow && (
        <PayrollModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}
