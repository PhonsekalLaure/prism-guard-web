import { useCallback, useEffect, useState } from 'react';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import BillingHolidayModal from '@hris-components/billing/BillingHolidayModal';
import { getPayrollErrorMessage } from './payrollPageUtils';
import payrollService from '@services/hris/payrollService';
import '../../../styles/hris/Billing.css';

export default function PayrollHolidayManager({
  cutoff,
  isOpen,
  onClose,
  showNotification,
}) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadHolidays = useCallback(async () => {
    if (!cutoff) return;
    try {
      setLoading(true);
      const data = await payrollService.getHolidays({
        periodStart: cutoff.periodStart,
        periodEnd: cutoff.periodEnd,
      });
      setHolidays(data || []);
    } catch (err) {
      showNotification(getPayrollErrorMessage(err, 'Failed to load holidays.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [cutoff, showNotification]);

  useEffect(() => {
    if (isOpen) loadHolidays();
  }, [isOpen, loadHolidays]);

  const saveHoliday = async (form, onSaved) => {
    try {
      setSaving(true);
      const payload = {
        holiday_date: form.holiday_date,
        name: form.name,
        payroll_type: form.payroll_type || null,
        notes: form.notes,
      };
      if (form.id) {
        await payrollService.updateHoliday(form.id, payload);
        showNotification('Holiday updated. Recalculate the draft to update payroll.', 'success');
      } else {
        await payrollService.createHoliday(payload);
        showNotification('Holiday added. Recalculate the draft to update payroll.', 'success');
      }
      onSaved?.();
      await loadHolidays();
    } catch (err) {
      showNotification(getPayrollErrorMessage(err, 'Failed to save holiday.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget.id);
      await payrollService.deleteHoliday(deleteTarget.id);
      showNotification('Holiday deleted. Recalculate the draft to update payroll.', 'success');
      await loadHolidays();
      setDeleteTarget(null);
    } catch (err) {
      showNotification(getPayrollErrorMessage(err, 'Failed to delete holiday.'), 'error');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <>
      <ReportConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Holiday?"
        description={deleteTarget
          ? `Delete ${deleteTarget.name}? Existing payroll will remain unchanged until a draft is recalculated.`
          : ''}
        confirmLabel="Delete Holiday"
        loading={Boolean(deletingId)}
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <BillingHolidayModal
        isOpen={isOpen}
        cutoff={cutoff}
        holidays={holidays}
        loading={loading}
        saving={saving}
        deletingId={deletingId}
        context="payroll"
        onClose={onClose}
        onSave={saveHoliday}
        onDelete={setDeleteTarget}
      />
    </>
  );
}
