import { useRef, useState } from 'react';
import {
  FaCalendar,
  FaCamera,
  FaCloudUploadAlt,
  FaFileInvoice,
  FaHashtag,
  FaInfoCircle,
  FaMoneyBill,
  FaPaperPlane,
  FaUniversity,
} from 'react-icons/fa';

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SubmitPaymentForm({
  invoice,
  submitting = false,
  onCancel,
  onSubmit,
}) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    amount: invoice ? String(invoice.balance_due || invoice.total_amount || '') : '',
    date: '',
    method: '',
    reference: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const invoiceLabel = invoice?.invoice_number || invoice?.statement_no || 'Statement pending';

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ ...form, receiptFile });
  };

  return (
    <div className="cms-sp-wrapper">
      <div className="cms-sp-info-banner">
        <FaInfoCircle className="cms-sp-info-icon" />
        <p className="cms-sp-info-text">
          Upload the payment receipt for the selected statement. This does not process a direct online payment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cms-sp-form">
        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaFileInvoice className="cms-sp-label-icon" />
            Selected Invoice
          </label>
          <input
            className="cms-sp-input"
            value={invoice ? `${invoiceLabel} - PHP ${formatCurrency(invoice.balance_due)}` : 'Select an unpaid invoice'}
            readOnly
            required
          />
        </div>

        <div className="cms-sp-grid">
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaMoneyBill className="cms-sp-label-icon" />
              Amount Paid
            </label>
            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className="cms-sp-input"
              required
            />
          </div>
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaCalendar className="cms-sp-label-icon" />
              Date of Payment
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="cms-sp-input"
              required
            />
          </div>
        </div>

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaUniversity className="cms-sp-label-icon" />
            Payment Method
          </label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="cms-sp-input"
            required
          >
            <option value="">Select payment method...</option>
            <option value="Bank Transfer (BDO)">Bank Transfer (BDO)</option>
            <option value="Bank Transfer (BPI)">Bank Transfer (BPI)</option>
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="Check">Check</option>
          </select>
        </div>

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaHashtag className="cms-sp-label-icon" />
            Reference Number
          </label>
          <input
            type="text"
            name="reference"
            placeholder="Enter transaction reference number"
            value={form.reference}
            onChange={handleChange}
            className="cms-sp-input"
            required
          />
        </div>

        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaCamera className="cms-sp-label-icon" />
            Upload Proof of Payment
          </label>
          <button
            type="button"
            className="cms-sp-upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCloudUploadAlt className="cms-sp-upload-icon" />
            <p className="cms-sp-upload-text">
              {receiptFile ? receiptFile.name : 'Browse receipt file'}
            </p>
            <p className="cms-sp-upload-hint">JPG, PNG, or PDF up to 10MB</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="cms-sp-actions">
          <button type="submit" className="cms-sp-btn-submit" disabled={submitting || !invoice}>
            <FaPaperPlane /> {submitting ? 'Submitting...' : 'Submit Receipt'}
          </button>
          <button type="button" className="cms-sp-btn-cancel" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
