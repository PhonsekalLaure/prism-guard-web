import { useState } from 'react';
import {
  FaInfoCircle, FaFileInvoice, FaMoneyBill, FaCalendar,
  FaUniversity, FaHashtag, FaCamera, FaCloudUploadAlt,
  FaPaperPlane,
} from 'react-icons/fa';

export default function SubmitPaymentForm({ onCancel }) {
  const [form, setForm] = useState({
    invoice: '',
    amount: '',
    date: '',
    method: '',
    reference: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCancel?.();
  };

  return (
    <div className="cms-sp-wrapper">
      {/* Info Banner */}
      <div className="cms-sp-info-banner">
        <FaInfoCircle className="cms-sp-info-icon" />
        <p className="cms-sp-info-text">
          Submit your payment details and upload proof of payment. Our finance team will
          verify within 24-48 business hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cms-sp-form">
        {/* Invoice Select */}
        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaFileInvoice className="cms-sp-label-icon" />
            Select Invoice
          </label>
          <select
            name="invoice"
            value={form.invoice}
            onChange={handleChange}
            className="cms-sp-input"
            required
          >
            <option value="">Select invoice to pay...</option>
            <option value="INV-2026-042">INV-2026-042 — ₱82,500.00 (Due Feb 28)</option>
          </select>
        </div>

        {/* Amount + Date */}
        <div className="cms-sp-grid">
          <div className="cms-sp-field">
            <label className="cms-sp-label">
              <FaMoneyBill className="cms-sp-label-icon" />
              Amount Paid
            </label>
            <input
              type="text"
              name="amount"
              placeholder="₱0.00"
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

        {/* Payment Method */}
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
            <option value="bdo">Bank Transfer (BDO)</option>
            <option value="bpi">Bank Transfer (BPI)</option>
            <option value="gcash">GCash</option>
            <option value="maya">Maya</option>
            <option value="check">Check</option>
          </select>
        </div>

        {/* Reference Number */}
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

        {/* Upload Proof */}
        <div className="cms-sp-field">
          <label className="cms-sp-label">
            <FaCamera className="cms-sp-label-icon" />
            Upload Proof of Payment
          </label>
          <div className="cms-sp-upload-zone">
            <FaCloudUploadAlt className="cms-sp-upload-icon" />
            <p className="cms-sp-upload-text">
              Drag &amp; drop or <span className="cms-sp-upload-link">browse</span>
            </p>
            <p className="cms-sp-upload-hint">JPG, PNG, PDF up to 10MB</p>
          </div>
        </div>

        {/* Actions */}
        <div className="cms-sp-actions">
          <button type="submit" className="cms-sp-btn-submit">
            <FaPaperPlane /> Submit Payment
          </button>
          <button
            type="button"
            className="cms-sp-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}