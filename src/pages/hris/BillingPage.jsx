import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import BillingTopbar from '@hris-components/billing/BillingTopbar';
import BillingStatCards from '@hris-components/billing/BillingStatCards';
import BillingFilterBar from '@hris-components/billing/BillingFilterBar';
import BillingTable from '@hris-components/billing/BillingTable';
import BillingHolidayModal from '@hris-components/billing/BillingHolidayModal';
import Notification from '@components/ui/Notification';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import useNotification from '@hooks/useNotification';
import useReportAction from '@hooks/useReportAction';
import billingService from '@services/hris/billingService';
import { getDefaultPayrollPeriod, getPayrollCutoffOptions } from '@hris-components/payroll/payrollPageUtils';

const PAGE_LIMIT = 8;
const DEFAULT_METADATA = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 };
const ALL_CUTOFFS_KEY = 'all';

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

function formatPreviewCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}



function resolveCutoffState(cutoffOptions, defaultPeriod, cutoffKey) {
  if (cutoffKey === ALL_CUTOFFS_KEY) {
    return { key: ALL_CUTOFFS_KEY, periodStart: '', periodEnd: '' };
  }

  const cutoff = cutoffOptions.find((option) => option.key === cutoffKey && !option.disabled);
  if (cutoff) {
    return {
      key: cutoff.key,
      periodStart: cutoff.periodStart,
      periodEnd: cutoff.periodEnd,
    };
  }

  return {
    key: defaultPeriod.key,
    periodStart: defaultPeriod.start,
    periodEnd: defaultPeriod.end,
  };
}

export default function BillingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const cutoffOptions = useMemo(() => getPayrollCutoffOptions(), []);
  const defaultPeriod = useMemo(() => getDefaultPayrollPeriod(), []);
  const cutoffParam = searchParams.get('cutoff') || '';
  const initialCutoffState = useMemo(
    () => resolveCutoffState(cutoffOptions, defaultPeriod, cutoffParam),
    [cutoffOptions, cutoffParam, defaultPeriod]
  );
  const [selectedCutoffKey, setSelectedCutoffKey] = useState(initialCutoffState.key);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    periodStart: initialCutoffState.periodStart,
    periodEnd: initialCutoffState.periodEnd,
  });
  const [records, setRecords] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [checkingGeneration, setCheckingGeneration] = useState(false);
  const [confirmGeneration, setConfirmGeneration] = useState(null);
  const [selectedClients, setSelectedClients] = useState([]);
  const [expandedClients, setExpandedClients] = useState([]);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidaySaving, setHolidaySaving] = useState(false);
  const [holidayDeletingId, setHolidayDeletingId] = useState('');
  const [holidayDeleteTarget, setHolidayDeleteTarget] = useState(null);
  const skipNextFilterLoadRef = useRef(false);
  const billingRequestRef = useRef(0);
  const { notification, showNotification, closeNotification } = useNotification();

  const updateCutoffParam = useCallback((cutoffKey) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!cutoffKey || cutoffKey === defaultPeriod.key) {
      nextParams.delete('cutoff');
    } else {
      nextParams.set('cutoff', cutoffKey);
    }
    setSearchParams(nextParams);
  }, [defaultPeriod.key, searchParams, setSearchParams]);

  const activeCutoffLabel = useMemo(() => {
    if (!filters.periodStart || !filters.periodEnd) return '';
    return cutoffOptions.find((option) => (
      option.periodStart === filters.periodStart && option.periodEnd === filters.periodEnd
    ))?.label || `${filters.periodStart} - ${filters.periodEnd}`;
  }, [cutoffOptions, filters.periodEnd, filters.periodStart]);

  const selectedCutoff = useMemo(() => (
    cutoffOptions.find((option) => option.key === selectedCutoffKey && !option.disabled)
  ), [cutoffOptions, selectedCutoffKey]);

  const loadStats = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setStatsLoading(true);
      const data = await billingService.getStats();
      setStats(data);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing stats.'), 'error');
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, [showNotification]);

  const loadBillings = useCallback(async (page = 1, currentFilters = filters, { silent = false } = {}) => {
    const requestId = billingRequestRef.current + 1;
    billingRequestRef.current = requestId;
    try {
      if (!silent) setLoading(true);
      const result = await billingService.getBillings({
        page,
        limit: PAGE_LIMIT,
        search: currentFilters.search || undefined,
        status: currentFilters.status || undefined,
        periodStart: currentFilters.periodStart || undefined,
        periodEnd: currentFilters.periodEnd || undefined,
      });
      if (requestId !== billingRequestRef.current) return;
      setRecords(result.data || []);
      setMetadata(result.metadata || { ...DEFAULT_METADATA, page });
    } catch (error) {
      if (requestId !== billingRequestRef.current) return;
      setRecords([]);
      setMetadata({ ...DEFAULT_METADATA, page });
      showNotification(getErrorMessage(error, 'Failed to load billing statements.'), 'error');
    } finally {
      if (!silent && requestId === billingRequestRef.current) setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const nextCutoffState = resolveCutoffState(cutoffOptions, defaultPeriod, cutoffParam);
    setSelectedCutoffKey(nextCutoffState.key);
    setFilters((prev) => {
      if (
        prev.periodStart === nextCutoffState.periodStart
        && prev.periodEnd === nextCutoffState.periodEnd
      ) {
        return prev;
      }
      return {
        ...prev,
        periodStart: nextCutoffState.periodStart,
        periodEnd: nextCutoffState.periodEnd,
      };
    });
  }, [cutoffOptions, cutoffParam, defaultPeriod]);

  useEffect(() => {
    if (skipNextFilterLoadRef.current) {
      skipNextFilterLoadRef.current = false;
      return;
    }
    loadBillings(1, filters);
  }, [filters, loadBillings]);

  const handleCutoffChange = (cutoffKey) => {
    if (cutoffKey === ALL_CUTOFFS_KEY) {
      setSelectedCutoffKey(ALL_CUTOFFS_KEY);
      updateCutoffParam(ALL_CUTOFFS_KEY);
      setFilters((prev) => ({ ...prev, periodStart: '', periodEnd: '' }));
      return;
    }

    const cutoff = cutoffOptions.find((option) => option.key === cutoffKey);
    if (!cutoff || cutoff.disabled) return;
    setSelectedCutoffKey(cutoff.key);
    updateCutoffParam(cutoff.key);
    setFilters((prev) => ({
      ...prev,
      periodStart: cutoff.periodStart,
      periodEnd: cutoff.periodEnd,
    }));
  };

  const generateStatementsAction = useReportAction({
    successMessage: (result) => {
      const count = (result?.created?.length || 0) + (result?.refreshed?.length || 0);
      return `Generated ${count} billing statement${count === 1 ? '' : 's'}.`;
    },
    errorFallback: 'Failed to generate billing statements.',
    showNotification,
    run: ({ cutoff, clientIds }) => billingService.generateStatements({
      period_start: cutoff.periodStart,
      period_end: cutoff.periodEnd,
      client_ids: clientIds,
    }),
    afterSuccess: async (_result, { cutoff }) => {
      const nextFilters = {
        ...filters,
        periodStart: cutoff.periodStart,
        periodEnd: cutoff.periodEnd,
      };
      skipNextFilterLoadRef.current = true;
      setSelectedCutoffKey(cutoff.key);
      updateCutoffParam(cutoff.key);
      setFilters(nextFilters);
      await Promise.all([
        loadBillings(1, nextFilters, { silent: true }),
        loadStats({ silent: true }),
      ]);
    },
  });

  const handleGenerate = async () => {
    const cutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);
    if (!cutoff || cutoff.disabled) return;

    try {
      setCheckingGeneration(true);
      const preview = await billingService.previewStatements({
        period_start: cutoff.periodStart,
        period_end: cutoff.periodEnd,
      });
      const initialChecked = [
        ...(preview.created || []).map((item) => item.client_id),
        ...(preview.refreshed || [])
          .filter((item) => Number(item.delta || 0) !== 0)
          .map((item) => item.client_id),
      ];
      setSelectedClients(initialChecked);
      setConfirmGeneration({ cutoff, preview });
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to preview billing statements.'), 'error');
    } finally {
      setCheckingGeneration(false);
    }
  };

  const loadHolidays = useCallback(async (cutoff = selectedCutoff) => {
    if (!cutoff) return;
    try {
      setHolidaysLoading(true);
      const data = await billingService.getHolidays({
        periodStart: cutoff.periodStart,
        periodEnd: cutoff.periodEnd,
      });
      setHolidays(data || []);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing holidays.'), 'error');
    } finally {
      setHolidaysLoading(false);
    }
  }, [selectedCutoff, showNotification]);

  const openHolidayModal = async () => {
    if (!selectedCutoff) return;
    setHolidayModalOpen(true);
    await loadHolidays(selectedCutoff);
  };

  const saveHoliday = async (form, onSaved) => {
    try {
      setHolidaySaving(true);
      const payload = {
        holiday_date: form.holiday_date,
        name: form.name,
        rate_per_guard: form.rate_per_guard,
        notes: form.notes,
      };
      if (form.id) {
        await billingService.updateHoliday(form.id, payload);
        showNotification('Holiday updated.', 'success');
      } else {
        await billingService.createHoliday(payload);
        showNotification('Holiday added.', 'success');
      }
      onSaved?.();
      await loadHolidays(selectedCutoff);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to save holiday.'), 'error');
    } finally {
      setHolidaySaving(false);
    }
  };

  const requestDeleteHoliday = (holiday) => {
    setHolidayDeleteTarget(holiday);
  };

  const confirmDeleteHoliday = async () => {
    if (!holidayDeleteTarget) return;
    try {
      setHolidayDeletingId(holidayDeleteTarget.id);
      await billingService.deleteHoliday(holidayDeleteTarget.id);
      showNotification('Holiday deleted.', 'success');
      await loadHolidays(selectedCutoff);
      setHolidayDeleteTarget(null);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to delete holiday.'), 'error');
    } finally {
      setHolidayDeletingId('');
    }
  };

  const handleConfirmRegenerate = async () => {
    if (!confirmGeneration?.cutoff) return;
    const result = await generateStatementsAction.execute({
      cutoff: confirmGeneration.cutoff,
      clientIds: selectedClients,
    });
    if (result) setConfirmGeneration(null);
  };

  const toggleClientSelection = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleClientExpanded = (clientId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const clearCutoffFilter = () => {
    setSelectedCutoffKey(ALL_CUTOFFS_KEY);
    updateCutoffParam(ALL_CUTOFFS_KEY);
    setFilters((prev) => ({ ...prev, periodStart: '', periodEnd: '' }));
  };

  const handleViewBilling = (record) => {
    navigate(`/billing/${record.id}`, {
      state: { returnTo: `${location.pathname}${location.search}` },
    });
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <BillingTopbar
        cutoffOptions={cutoffOptions}
        selectedCutoffKey={selectedCutoffKey}
        onCutoffChange={handleCutoffChange}
        onAddHoliday={openHolidayModal}
        onGenerate={handleGenerate}
        generating={checkingGeneration || generateStatementsAction.loading}
      />

      <div className="dashboard-content">
        <BillingStatCards stats={stats} loading={statsLoading} />
        <BillingFilterBar filters={filters} onFilterChange={setFilters} />
        {activeCutoffLabel && (
          <div className="billing-active-filter">
            <span>Showing {activeCutoffLabel}</span>
            <button type="button" onClick={clearCutoffFilter}>Clear cutoff</button>
          </div>
        )}
        <BillingTable
          records={records}
          metadata={metadata}
          loading={loading}
          onView={handleViewBilling}
          onPageChange={(page) => loadBillings(page, filters)}
        />
      </div>

      <ReportConfirmDialog
        open={Boolean(confirmGeneration)}
        title={
          (confirmGeneration?.preview?.blocked || []).length > 0
            ? 'Preview: Review and Confirm Statements'
            : 'Generate Previewed Statements?'
        }
        description={
          confirmGeneration
            ? `Billing statement generation preview for ${confirmGeneration.cutoff.label}.`
            : ''
        }
        confirmLabel="Apply Preview"
        loading={generateStatementsAction.loading}
        tone={
          (confirmGeneration?.preview?.blocked || []).length > 0
            ? 'warning'
            : (confirmGeneration?.preview?.summary?.refreshed || 0) > 0
            ? 'warning'
            : 'info'
        }
        width="min(680px, 100%)"
        onCancel={() => setConfirmGeneration(null)}
        onConfirm={handleConfirmRegenerate}
      >
        {confirmGeneration?.preview && (
          <div className="billing-preview-summary-container">
            {/* Stats Row */}
            <div className="billing-preview-stats-row">
              <div className="preview-stat-card preview-stat-card--new">
                <span className="stat-count">{confirmGeneration.preview.summary.created || 0}</span>
                <span className="stat-label">New</span>
              </div>
              <div className="preview-stat-card preview-stat-card--refreshed">
                <span className="stat-count">{confirmGeneration.preview.summary.refreshed || 0}</span>
                <span className="stat-label">Updated</span>
              </div>
              <div className="preview-stat-card preview-stat-card--skipped">
                <span className="stat-count">{confirmGeneration.preview.summary.skipped || 0}</span>
                <span className="stat-label">Skipped</span>
              </div>
              <div className="preview-stat-card preview-stat-card--blocked">
                <span className="stat-count">{confirmGeneration.preview.summary.blocked || 0}</span>
                <span className="stat-label">Blocked</span>
              </div>
            </div>

            {/* Total Proposed Amount */}
            <div className="billing-preview-total-card">
              <span className="total-label">Total Proposed Billing</span>
              <span className="total-amount">
                {formatPreviewCurrency(confirmGeneration.preview.summary.total_proposed || 0)}
              </span>
            </div>

            {/* Holidays Alert Banner */}
            {confirmGeneration.preview.holidays && confirmGeneration.preview.holidays.length > 0 && (
              <div className="billing-preview-holidays-alert">
                <div className="holidays-alert-header">
                  <span className="holiday-icon">📅</span>
                  <span>Includes {confirmGeneration.preview.holidays.length} holiday{confirmGeneration.preview.holidays.length > 1 ? 's' : ''} in this period</span>
                </div>
                <div className="holidays-list">
                  {confirmGeneration.preview.holidays.map((h, i) => (
                    <span key={i} className="holiday-tag">
                      <strong>{h.name}</strong> (+{formatPreviewCurrency(h.rate_per_guard)}/guard)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Checklist */}
            <div className="billing-preview-list">
              {(confirmGeneration.preview.blocked || []).length > 0 && (
                <div className="billing-preview-group billing-preview-group--blocked">
                  <h4>Blocked Paid Statements ({(confirmGeneration.preview.blocked || []).length})</h4>
                  <p className="group-warning-text">
                    Checking these will force recalculation, reverting status to partial or creating client credit. Unchecked items will be skipped.
                  </p>
                  {confirmGeneration.preview.blocked.map((item) => (
                    <div key={item.client_id} className="billing-preview-item-wrapper">
                      <div className="billing-preview-item" onClick={() => toggleClientSelection(item.client_id)}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(item.client_id)}
                          onChange={() => {}}
                        />
                        <span className="client-name">{item.company}</span>
                        <div className="proposed-total-wrapper">
                          <span className="proposed-total">
                            {formatPreviewCurrency(item.proposed_total)}
                            <span className={`delta-badge ${item.delta > 0 ? 'delta-badge--danger' : 'delta-badge--success'}`}>
                              {item.delta >= 0 ? '+' : ''}{formatPreviewCurrency(item.delta)}
                            </span>
                          </span>
                          <button
                            className={`expand-details-btn ${expandedClients.includes(item.client_id) ? 'expanded' : ''}`}
                            onClick={(e) => toggleClientExpanded(item.client_id, e)}
                            title="View Statement Breakdown"
                            type="button"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      {expandedClients.includes(item.client_id) && (
                        <div className="billing-preview-item-details">
                          <div className="details-header">
                            <span>{item.guard_count} Guards × {formatPreviewCurrency(item.rate_per_guard)}/guard</span>
                          </div>
                          <table className="details-table">
                            <tbody>
                              {(item.line_items || []).map((li, i) => (
                                <tr key={i}>
                                  <td>
                                    <span className="li-desc">{li.description}</span>
                                    {li.detail && <span className="li-detail">{li.detail}</span>}
                                  </td>
                                  <td className="li-amount">{formatPreviewCurrency(li.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(confirmGeneration.preview.created || []).length > 0 && (
                <div className="billing-preview-group">
                  <h4>New Statements ({(confirmGeneration.preview.created || []).length})</h4>
                  {confirmGeneration.preview.created.map((item) => (
                    <div key={item.client_id} className="billing-preview-item-wrapper">
                      <div className="billing-preview-item" onClick={() => toggleClientSelection(item.client_id)}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(item.client_id)}
                          onChange={() => {}}
                        />
                        <span className="client-name">{item.company}</span>
                        <div className="proposed-total-wrapper">
                          <span className="proposed-total">{formatPreviewCurrency(item.proposed_total)}</span>
                          <button
                            className={`expand-details-btn ${expandedClients.includes(item.client_id) ? 'expanded' : ''}`}
                            onClick={(e) => toggleClientExpanded(item.client_id, e)}
                            title="View Statement Breakdown"
                            type="button"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      {expandedClients.includes(item.client_id) && (
                        <div className="billing-preview-item-details">
                          <div className="details-header">
                            <span>{item.guard_count} Guards × {formatPreviewCurrency(item.rate_per_guard)}/guard</span>
                          </div>
                          <table className="details-table">
                            <tbody>
                              {(item.line_items || []).map((li, i) => (
                                <tr key={i}>
                                  <td>
                                    <span className="li-desc">{li.description}</span>
                                    {li.detail && <span className="li-detail">{li.detail}</span>}
                                  </td>
                                  <td className="li-amount">{formatPreviewCurrency(li.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(confirmGeneration.preview.refreshed || []).length > 0 && (
                <div className="billing-preview-group">
                  <h4>Updated Statements ({(confirmGeneration.preview.refreshed || []).length})</h4>
                  {confirmGeneration.preview.refreshed.map((item) => (
                    <div key={item.client_id} className="billing-preview-item-wrapper">
                      <div className="billing-preview-item" onClick={() => toggleClientSelection(item.client_id)}>
                        <input
                          type="checkbox"
                          checked={selectedClients.includes(item.client_id)}
                          onChange={() => {}}
                        />
                        <span className="client-name">{item.company}</span>
                        <div className="proposed-total-wrapper">
                          <span className="proposed-total">
                            {formatPreviewCurrency(item.proposed_total)}
                            <span className="delta-badge delta-badge--neutral">
                              {item.delta >= 0 ? '+' : ''}{formatPreviewCurrency(item.delta)}
                            </span>
                          </span>
                          <button
                            className={`expand-details-btn ${expandedClients.includes(item.client_id) ? 'expanded' : ''}`}
                            onClick={(e) => toggleClientExpanded(item.client_id, e)}
                            title="View Statement Breakdown"
                            type="button"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      {expandedClients.includes(item.client_id) && (
                        <div className="billing-preview-item-details">
                          <div className="details-header">
                            <span>{item.guard_count} Guards × {formatPreviewCurrency(item.rate_per_guard)}/guard</span>
                          </div>
                          <table className="details-table">
                            <tbody>
                              {(item.line_items || []).map((li, i) => (
                                <tr key={i}>
                                  <td>
                                    <span className="li-desc">{li.description}</span>
                                    {li.detail && <span className="li-detail">{li.detail}</span>}
                                  </td>
                                  <td className="li-amount">{formatPreviewCurrency(li.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </ReportConfirmDialog>

      <ReportConfirmDialog
        open={Boolean(holidayDeleteTarget)}
        title="Delete Holiday?"
        description={holidayDeleteTarget
          ? `Delete ${holidayDeleteTarget.name}? Existing statements will not change until this cutoff is regenerated.`
          : ''}
        confirmLabel="Delete Holiday"
        loading={Boolean(holidayDeletingId)}
        tone="danger"
        onCancel={() => setHolidayDeleteTarget(null)}
        onConfirm={confirmDeleteHoliday}
      />

      <BillingHolidayModal
        isOpen={holidayModalOpen}
        cutoff={selectedCutoff}
        holidays={holidays}
        loading={holidaysLoading}
        saving={holidaySaving}
        deletingId={holidayDeletingId}
        onClose={() => setHolidayModalOpen(false)}
        onSave={saveHoliday}
        onDelete={requestDeleteHoliday}
      />
    </>
  );
}
