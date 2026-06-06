import { useState } from 'react';
import {
  FaCalendar,
  FaHashtag,
  FaMoneyBillWave,
  FaPaperPlane,
  FaReceipt,
  FaUniversity,
} from 'react-icons/fa';
import ReportActionButton from '@components/ui/ReportActionButton';
import ReceiptUploadField from './ReceiptUploadField';
import {
  formatCurrency,
  formatCurrencyRaw,
  formatDate,
  getTodayDateInputValue,
  isAllowedReceiptFile,
  MAX_RECEIPT_SIZE_BYTES,
} from './billingUi';

export default function BillingPaymentForm({
  invoice,
  submitting = false,
  onCancel,
  onSubmit,
}) {
  const [payForm, setPayForm] = useState({
    date: '',
    method: '',
    methodOther: '',
    reference: '',
    notes: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dateError, setDateError] = useState('');
  const todayDate = getTodayDateInputValue();

  const handleFileChange = (file) => {
    setFileError('');
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!isAllowedReceiptFile(file)) {
      setReceiptFile(null);
      setFileError('Only JPG, PNG, or PDF receipts are allowed.');
      return;
    }
    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      setReceiptFile(null);
      setFileError('Receipt file must be 10MB or smaller.');
      return;
    }
    setReceiptFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fileError || dateError || !receiptFile) return;
    if (payForm.date && payForm.date > todayDate) {
      setDateError('Payment date cannot be later than today.');
      return;
    }
    onSubmit?.({
      amount: invoice.balance_due,
      date: payForm.date,
      method: payForm.method,
      methodOther: payForm.methodOther,
      reference: payForm.reference,
      notes: payForm.notes,
      receiptFile,
    });
  };

  return (
    <>
      <div className="cms-bdetail-pay-strip">
        <div className="cms-bdetail-pay-identity">
          <p className="cms-bdetail-pay-company">{invoice.company || 'Billing Statement'}</p>
          <p className="cms-bdetail-pay-addr">{invoice.billing_address || '-'}</p>
        </div>
        <div className="cms-bdetail-pay-meta">
          <div className="cms-bdetail-pay-stat">
            <span>Balance Due</span>
            <strong>{formatCurrency(invoice.balance_due)}</strong>
          </div>
          <div className="cms-bdetail-pay-stat cms-bdetail-pay-stat--muted">
            <span>Due Date</span>
            <strong>{formatDate(invoice.due_date)}</strong>
          </div>
        </div>
      </div>

      <form className="cms-bdetail-pay-form" onSubmit={handleSubmit}>
        <div className="cms-bdetail-pay-grid">
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaMoneyBillWave className="cms-sp-label-icon" /> Amount Paid
            </label>
            <input
              className="cms-sp-input"
              value={`PHP ${formatCurrencyRaw(invoice.balance_due)}`}
              readOnly
            />
            <p className="cms-sp-help">Locked to current balance due.</p>
          </div>
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaCalendar className="cms-sp-label-icon" /> Date of Payment
            </label>
            <input
              type="date"
              className="cms-sp-input"
              value={payForm.date}
              onChange={(e) => {
                const nextDate = e.target.value;
                setDateError(nextDate && nextDate > todayDate ? 'Payment date cannot be later than today.' : '');
                setPayForm((p) => ({ ...p, date: nextDate }));
              }}
              max={todayDate}
              required
            />
            {dateError && <p className="cms-sp-error">{dateError}</p>}
          </div>
        </div>

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaUniversity className="cms-sp-label-icon" /> Payment Method
          </label>
          <select
            className="cms-sp-input"
            value={payForm.method}
            onChange={(e) => setPayForm((p) => ({ ...p, method: e.target.value }))}
            required
          >
            <option value="">Select payment method...</option>
            <option value="Bank Transfer (BDO)">Bank Transfer (BDO)</option>
            <option value="Bank Transfer (BPI)">Bank Transfer (BPI)</option>
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="Check">Check</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {payForm.method === 'Other' && (
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaUniversity className="cms-sp-label-icon" /> Specify Payment Method
            </label>
            <input
              type="text"
              className="cms-sp-input"
              placeholder="Enter payment method"
              value={payForm.methodOther}
              onChange={(e) => setPayForm((p) => ({ ...p, methodOther: e.target.value }))}
              required
            />
          </div>
        )}

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaHashtag className="cms-sp-label-icon" /> Reference Number
          </label>
          <input
            type="text"
            className="cms-sp-input"
            placeholder="Enter transaction reference number"
            value={payForm.reference}
            onChange={(e) => setPayForm((p) => ({ ...p, reference: e.target.value }))}
            required
          />
        </div>

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaReceipt className="cms-sp-label-icon" /> Payment Notes
          </label>
          <textarea
            className="cms-sp-input"
            rows={3}
            placeholder="Optional note for HRIS finance"
            value={payForm.notes}
            onChange={(e) => setPayForm((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>

        <ReceiptUploadField
          file={receiptFile}
          error={fileError}
          onChange={handleFileChange}
          onClearError={() => setFileError('')}
        />

        <div className="cms-bdetail-pay-actions">
          <ReportActionButton
            type="submit"
            className="cms-sp-action-btn"
            label="Submit Receipt"
            loadingLabel="Submitting..."
            icon={FaPaperPlane}
            variant="primary"
            loading={submitting}
            disabled={Boolean(fileError) || Boolean(dateError) || !receiptFile}
          />
          <button
            type="button"
            className="cms-sp-btn-cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
