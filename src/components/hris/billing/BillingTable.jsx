import { useState } from 'react';
import {
  FaEye, FaBell, FaCheck, FaChevronLeft, FaChevronRight, FaListUl,
} from 'react-icons/fa';

const billingRecords = [
  {
    initials: 'FIT',
    bgColor: '#093269',
    company: 'FEU Institute of Technology',
    tin: '123456',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱40,000',
    amountPaid: '₱40,000',
    dueDate: 'Feb 25, 2026',
    status: 'paid',
  },
  {
    initials: 'SMA',
    bgColor: '#dc2626',
    company: 'SM Mall of Asia',
    tin: '234567',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱50,000',
    amountPaid: '₱50,000',
    dueDate: 'Feb 25, 2026',
    status: 'partial',
  },
  {
    initials: 'SMN',
    bgColor: '#2563eb',
    company: 'SM North EDSA',
    tin: '345678',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱20,000',
    amountPaid: '₱0',
    dueDate: 'Feb 19, 2026',
    status: 'overdue',
  },
  {
    initials: 'RG',
    bgColor: '#7c3aed',
    company: 'Robinsons Galleria',
    tin: '456789',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱31,000',
    amountPaid: '₱31,000',
    dueDate: 'Feb 25, 2026',
    status: 'paid',
  },
  {
    initials: 'AM',
    bgColor: '#059669',
    company: 'Ayala Malls Manila Bay',
    tin: '567890',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱60,000',
    amountPaid: '₱60,000',
    dueDate: 'Feb 25, 2026',
    status: 'paid',
  },
  {
    initials: 'VH',
    bgColor: '#d97706',
    company: 'Vista Heights Subdivision',
    tin: '678901',
    period: 'Feb 1 – 15, 2026',
    amountDue: '₱44,000',
    amountPaid: '₱0',
    dueDate: 'Feb 25, 2026',
    status: 'unpaid',
  },
];

const statusConfig = {
  paid: {
    label: 'PAID',
    className: 'billing-badge billing-badge--paid',
  },
  partial: {
    label: 'PENDING',
    className: 'billing-badge billing-badge--partial',
  },
  unpaid: {
    label: 'UNPAID',
    className: 'billing-badge billing-badge--unpaid',
  },
  overdue: {
    label: 'OVERDUE',
    className: 'billing-badge billing-badge--overdue',
  },
};

function ActionButtons({ record, onView, onMarkPaid }) {
  const { status } = record;

  return (
    <div className="billing-actions">
      <button
        className="billing-action-btn billing-action-btn--view"
        onClick={() => onView(record)}
      >
        <FaEye />
        View
      </button>
      {status === 'overdue' && (
        <button className="billing-action-btn billing-action-btn--remind">
          <FaBell />
          Remind
        </button>
      )}
      {(status === 'unpaid' || status === 'partial') && (
        <button
          className="billing-action-btn billing-action-btn--pay"
          onClick={() => onMarkPaid(record)}
        >
          <FaCheck />
          {status === 'partial' ? 'Update' : 'Mark Paid'}
        </button>
      )}
    </div>
  );
}

export default function BillingTable({ onView, onMarkPaid }) {
  return (
    <div className="billing-table-panel">
      {/* Table Header */}
      <div className="billing-table-header">
        <h3 className="billing-table-title">
          <FaListUl />
          Client Billing Records
        </h3>
      </div>

      {/* Table */}
      <div className="billing-table-wrapper">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Billing Period</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billingRecords.map((record, i) => {
              const badge = statusConfig[record.status];
              const isOverdue = record.status === 'overdue';
              const paidColor =
                record.amountPaid === '₱0'
                  ? '#dc2626'
                  : record.status === 'partial'
                  ? '#ca8a04'
                  : '#16a34a';

              return (
                <tr
                  key={i}
                  className={`billing-table-row${isOverdue ? ' billing-table-row--overdue' : ''}`}
                >
                  {/* Client */}
                  <td>
                    <div className="billing-client-cell">
                      <div
                        className="billing-initials"
                        style={{ background: record.bgColor }}
                      >
                        {record.initials}
                      </div>
                      <span className="billing-company-name">{record.company}</span>
                    </div>
                  </td>

                  {/* Period */}
                  <td className="billing-td-muted">{record.period}</td>

                  {/* Amount Due */}
                  <td className="billing-td-bold">{record.amountDue}</td>

                  {/* Amount Paid */}
                  <td
                    className="billing-td-bold"
                    style={{ color: paidColor }}
                  >
                    {record.amountPaid}
                  </td>

                  {/* Due Date */}
                  <td className="billing-td-muted">{record.dueDate}</td>

                  {/* Status */}
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>

                  {/* Actions */}
                  <td>
                    <ActionButtons
                      record={record}
                      onView={onView}
                      onMarkPaid={onMarkPaid}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="billing-pagination">
        <span className="billing-pagination-info">Showing 1-6 of 126 records</span>
        <div className="billing-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}
