import {
  FaCreditCard, FaDownload, FaEye, FaFileInvoice,
  FaReceipt, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

const invoices = [
  {
    id: 'INV-2026-042',
    period: 'Feb 1-15, 2026',
    amount: '₱82,500.00',
    dueDate: 'Feb 28, 2026',
    status: 'unpaid',
  },
  {
    id: 'INV-2026-041',
    period: 'Jan 16-31, 2026',
    amount: '₱43,000.00',
    dueDate: 'Feb 15, 2026',
    status: 'verifying',
  },
  {
    id: 'INV-2026-040',
    period: 'Jan 1-15, 2026',
    amount: '₱82,500.00',
    dueDate: 'Jan 31, 2026',
    status: 'paid',
  },
  {
    id: 'INV-2025-039',
    period: 'Dec 16-31, 2025',
    amount: '₱82,500.00',
    dueDate: 'Jan 15, 2026',
    status: 'paid',
  },
];

const statusConfig = {
  unpaid: { label: 'Unpaid', className: 'cms-inv-badge cms-inv-badge--unpaid' },
  verifying: { label: 'Verifying', className: 'cms-inv-badge cms-inv-badge--verifying' },
  paid: { label: 'Paid', className: 'cms-inv-badge cms-inv-badge--paid' },
};

function InvoiceActions({ status, onPay, onViewPdf }) {
  if (status === 'unpaid') {
    return (
      <div className="cms-inv-actions">
        <button className="cms-inv-btn cms-inv-btn--pay" onClick={onPay}>
          <FaCreditCard /> Pay
        </button>
        <button className="cms-inv-btn cms-inv-btn--pdf" onClick={onViewPdf}>
          <FaDownload /> PDF
        </button>
      </div>
    );
  }
  if (status === 'verifying') {
    return (
      <div className="cms-inv-actions">
        <button className="cms-inv-btn cms-inv-btn--view">
          <FaEye /> View
        </button>
        <button className="cms-inv-btn cms-inv-btn--pdf" onClick={onViewPdf}>
          <FaDownload /> PDF
        </button>
      </div>
    );
  }
  return (
    <div className="cms-inv-actions">
      <button className="cms-inv-btn cms-inv-btn--receipt">
        <FaReceipt /> Receipt
      </button>
      <button className="cms-inv-btn cms-inv-btn--pdf" onClick={onViewPdf}>
        <FaDownload /> PDF
      </button>
    </div>
  );
}

export default function InvoicesTable({ onSwitchToSubmit }) {
  return (
    <div>
      <div className="cms-inv-table-wrapper">
        <table className="cms-inv-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Period</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const badge = statusConfig[inv.status];
              return (
                <tr key={inv.id} className="cms-inv-row">
                  <td className="cms-inv-id">{inv.id}</td>
                  <td className="cms-inv-muted">{inv.period}</td>
                  <td className="cms-inv-amount">{inv.amount}</td>
                  <td className="cms-inv-muted">{inv.dueDate}</td>
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>
                  <td>
                    <InvoiceActions
                      status={inv.status}
                      onPay={onSwitchToSubmit}
                      onViewPdf={() => {}}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="cms-inv-pagination">
        <span className="cms-inv-pagination-info">Showing 1-4 of 4 invoices</span>
        <div className="cms-inv-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}