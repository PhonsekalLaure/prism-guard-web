import { useMemo, useState } from 'react';
import { FaCalendarDay, FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import ReportActionButton from '@components/ui/ReportActionButton';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const EMPTY_FORM = {
  id: '',
  holiday_date: '',
  name: '',
  rate_per_guard: '',
  payroll_type: '',
  notes: '',
};

export default function BillingHolidayModal({
  isOpen,
  cutoff,
  holidays = [],
  loading = false,
  saving = false,
  deletingId = '',
  context = 'billing',
  canManagePayrollType = true,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const title = useMemo(() => (
    cutoff ? `Holidays for ${cutoff.label}` : 'Shared Holidays'
  ), [cutoff]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const editHoliday = (holiday) => {
    setForm({
      id: holiday.id,
      holiday_date: holiday.holiday_date || '',
      name: holiday.name || '',
      rate_per_guard: holiday.rate_per_guard || '',
      payroll_type: holiday.payroll_type || '',
      notes: holiday.notes || '',
    });
  };

  const clearForm = () => {
    setForm({
      ...EMPTY_FORM,
      holiday_date: cutoff?.periodStart || '',
    });
  };

  const closeModal = () => {
    clearForm();
    onClose?.();
  };

  const isEditing = Boolean(form.id);
  const isBillingManagedInPayroll = context === 'payroll'
    && isEditing
    && form.rate_per_guard !== ''
    && form.rate_per_guard !== null;
  const isPayrollManagedInBilling = context === 'billing'
    && isEditing
    && Boolean(form.payroll_type)
    && !canManagePayrollType;
  const sharedDetailsDisabled = isBillingManagedInPayroll || isPayrollManagedInBilling;
  const minDate = cutoff?.periodStart || undefined;
  const maxDate = cutoff?.periodEnd || undefined;
  const holidayDateValue = form.holiday_date || cutoff?.periodStart || '';

  const submit = (event) => {
    event.preventDefault();
    onSave?.({ ...form, holiday_date: holidayDateValue }, clearForm);
  };

  return (
    <div className="bp-modal-overlay" onClick={() => !saving && closeModal()}>
      <section className="bp-modal-content billing-holiday-modal" onClick={(event) => event.stopPropagation()}>
        <header className="bp-modal-header">
          <div>
            <h2><FaCalendarDay /> Add Holiday</h2>
            <p>{title}</p>
          </div>
          <button className="billing-holiday-close" type="button" onClick={closeModal} disabled={saving}>
            <FaTimes />
          </button>
        </header>

        <div className="bp-modal-body billing-holiday-body">
          <p className="billing-holiday-regeneration-note">
            {context === 'payroll'
              ? 'Holiday changes apply to new payroll calculations. Recalculate an existing draft to update holiday pay; approved and paid runs remain unchanged.'
              : 'Holiday changes are used the next time statements are generated. Regenerate an existing cutoff after editing holidays to update invoice totals.'}
          </p>

          <form className="billing-holiday-form" onSubmit={submit}>
            <label className="billing-holiday-field">
              <span>Holiday Date</span>
              <input
                className="bp-input"
                type="date"
                min={minDate}
                max={maxDate}
                value={holidayDateValue}
                onChange={(event) => updateField('holiday_date', event.target.value)}
                disabled={sharedDetailsDisabled}
                required
              />
            </label>

            <label className="billing-holiday-field">
              <span>Holiday Name</span>
              <input
                className="bp-input"
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={sharedDetailsDisabled}
                placeholder="Christmas Day"
                required
              />
            </label>

            {context === 'billing' && (
              <label className="billing-holiday-field">
                <span>Holiday Rate per Guard</span>
                <input
                  className="bp-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rate_per_guard}
                  onChange={(event) => updateField('rate_per_guard', event.target.value)}
                  placeholder="933.50"
                  required
                />
              </label>
            )}

            <label className="billing-holiday-field">
              <span>Payroll Classification</span>
              <select
                className="bp-input"
                value={form.payroll_type}
                onChange={(event) => updateField('payroll_type', event.target.value)}
                disabled={!canManagePayrollType}
                required={context === 'payroll'}
              >
                <option value="">
                  {context === 'payroll' ? 'Select payroll type' : 'Billing only'}
                </option>
                <option value="regular">Regular holiday</option>
                <option value="special_non_working">Special non-working holiday</option>
              </select>
              {!canManagePayrollType && (
                <small>Payroll write permission is required to change this field.</small>
              )}
            </label>

            <label className="billing-holiday-field billing-holiday-field--full">
              <span>Notes</span>
              <textarea
                className="bp-input"
                rows={2}
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                disabled={sharedDetailsDisabled}
                placeholder="Optional internal note"
              />
            </label>

            <div className="billing-holiday-form-actions">
              {isEditing && (
                <button className="bp-btn-secondary" type="button" onClick={clearForm} disabled={saving}>
                  Cancel Edit
                </button>
              )}
              <ReportActionButton
                label={isEditing ? 'Save Holiday' : 'Add Holiday'}
                loadingLabel="Saving..."
                icon={isEditing ? FaSave : FaPlus}
                loading={saving}
                variant="primary"
                type="submit"
              />
            </div>
          </form>

          <div className="billing-holiday-list">
            <div className="billing-holiday-list-header">
              <h3>Cutoff Holidays</h3>
              <span>{holidays.length} total</span>
            </div>

            {loading && <p className="billing-holiday-empty">Loading holidays...</p>}

            {!loading && holidays.length === 0 && (
              <p className="billing-holiday-empty">
                No holidays added for this cutoff yet.
              </p>
            )}

            {!loading && holidays.map((holiday) => (
              <article className="billing-holiday-row" key={holiday.id}>
                <div>
                  <p className="billing-holiday-name">{holiday.name}</p>
                  <p className="billing-holiday-meta">
                    {formatDate(holiday.holiday_date)}
                    {holiday.rate_per_guard !== null
                      ? ` - ${formatCurrency(holiday.rate_per_guard)} per guard`
                      : ' - No client billing charge'}
                  </p>
                  <p className="billing-holiday-meta">
                    {holiday.payroll_type === 'regular'
                      ? 'Regular payroll holiday'
                      : holiday.payroll_type === 'special_non_working'
                        ? 'Special non-working payroll holiday'
                        : 'Billing only'}
                  </p>
                </div>
                <div className="billing-holiday-row-actions">
                  <button
                    type="button"
                    onClick={() => editHoliday(holiday)}
                    disabled={saving || deletingId === holiday.id}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onDelete?.(holiday)}
                    disabled={saving
                      || deletingId === holiday.id
                      || (!canManagePayrollType && holiday.payroll_type)
                      || (context === 'payroll' && !holiday.payroll_type)}
                  >
                    <FaTrash /> {deletingId === holiday.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
