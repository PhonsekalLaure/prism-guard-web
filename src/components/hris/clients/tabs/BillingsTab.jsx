import { FaHistory, FaFileInvoiceDollar } from 'react-icons/fa';
import { fmtDate, fmtMoney } from './ClientInfoCell';

export default function BillingsTab({ client }) {
  const billings = client.billings || [];

  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaHistory className="vc-section-icon" /> Billing Records
        </h3>

        {billings.length > 0 ? (
          <div className="vc-table-wrap">
            <table className="vc-table">
              <thead>
                <tr>
                  <th>Pay Period</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Paid</th>
                  <th className="text-right">Balance</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((b, i) => (
                  <tr key={b.id || i}>
                    <td className="fw-600">
                      {fmtDate(b.period_start)} — {fmtDate(b.period_end)}
                    </td>
                    <td className="text-right text-green">{fmtMoney(b.total_amount)}</td>
                    <td className="text-right">{fmtMoney(b.amount_paid)}</td>
                    <td className="text-right text-red">{fmtMoney(b.balance_due)}</td>
                    <td>{fmtDate(b.due_date)}</td>
                    <td>
                      <span className={`vc-bill-badge ${b.status}`}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="vc-empty">
            <FaFileInvoiceDollar className="vc-empty-icon" />
            <p className="vc-empty-text">No billing records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
