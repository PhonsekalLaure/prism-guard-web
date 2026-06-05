import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BillingTopbar from '@hris-components/billing/BillingTopbar';
import BillingStatCards from '@hris-components/billing/BillingStatCards';
import BillingFilterBar from '@hris-components/billing/BillingFilterBar';
import BillingTable from '@hris-components/billing/BillingTable';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import billingService from '@services/hris/billingService';
import { getDefaultPayrollPeriod, getPayrollCutoffOptions } from '@hris-components/payroll/payrollPageUtils';

const PAGE_LIMIT = 8;
const DEFAULT_METADATA = { total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 };

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

export default function BillingPage() {
  const navigate = useNavigate();
  const cutoffOptions = useMemo(() => getPayrollCutoffOptions(), []);
  const defaultPeriod = useMemo(() => getDefaultPayrollPeriod(), []);
  const [selectedCutoffKey, setSelectedCutoffKey] = useState(defaultPeriod.key);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    periodStart: '',
    periodEnd: '',
  });
  const [records, setRecords] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [confirmCutoff, setConfirmCutoff] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const activeCutoffLabel = useMemo(() => {
    if (!filters.periodStart || !filters.periodEnd) return '';
    return cutoffOptions.find((option) => (
      option.periodStart === filters.periodStart && option.periodEnd === filters.periodEnd
    ))?.label || `${filters.periodStart} - ${filters.periodEnd}`;
  }, [cutoffOptions, filters.periodEnd, filters.periodStart]);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await billingService.getStats();
      setStats(data);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing stats.'), 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [showNotification]);

  const loadBillings = useCallback(async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      const result = await billingService.getBillings({
        page,
        limit: PAGE_LIMIT,
        search: currentFilters.search || undefined,
        status: currentFilters.status || undefined,
        periodStart: currentFilters.periodStart || undefined,
        periodEnd: currentFilters.periodEnd || undefined,
      });
      setRecords(result.data || []);
      setMetadata(result.metadata || { ...DEFAULT_METADATA, page });
    } catch (error) {
      setRecords([]);
      setMetadata({ ...DEFAULT_METADATA, page });
      showNotification(getErrorMessage(error, 'Failed to load billing statements.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadBillings(1, filters);
  }, [filters, loadBillings]);

  const handleCutoffChange = (cutoffKey) => {
    const cutoff = cutoffOptions.find((option) => option.key === cutoffKey);
    if (!cutoff || cutoff.disabled) return;
    setSelectedCutoffKey(cutoff.key);
  };

  const executeGenerate = async (cutoff) => {
    try {
      setGenerating(true);
      const result = await billingService.generateStatements({
        period_start: cutoff.periodStart,
        period_end: cutoff.periodEnd,
      });
      const nextFilters = {
        ...filters,
        periodStart: cutoff.periodStart,
        periodEnd: cutoff.periodEnd,
      };
      setFilters(nextFilters);
      await Promise.all([loadBillings(1, nextFilters), loadStats()]);
      const count = (result.created?.length || 0) + (result.refreshed?.length || 0);
      showNotification(`Generated ${count} billing statement${count === 1 ? '' : 's'}.`, 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to generate billing statements.'), 'error');
    } finally {
      setConfirmCutoff(null);
      setGenerating(false);
    }
  };

  const handleGenerate = async () => {
    const cutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);
    if (!cutoff || cutoff.disabled) return;

    try {
      const existing = await billingService.getBillings({
        page: 1,
        limit: 1,
        periodStart: cutoff.periodStart,
        periodEnd: cutoff.periodEnd,
      });
      if ((existing.metadata?.total || 0) > 0) {
        setConfirmCutoff(cutoff);
        return;
      }
      await executeGenerate(cutoff);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to check existing billing statements.'), 'error');
    }
  };

  const clearCutoffFilter = () => {
    setFilters((prev) => ({ ...prev, periodStart: '', periodEnd: '' }));
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
        onGenerate={handleGenerate}
        generating={generating}
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
          onView={(record) => navigate(`/billing/${record.id}`)}
          onPageChange={(page) => loadBillings(page, filters)}
        />
      </div>

      {confirmCutoff && (
        <div className="bp-modal-overlay" onClick={() => setConfirmCutoff(null)}>
          <div className="bp-modal-content bp-modal-content--sm" onClick={(event) => event.stopPropagation()}>
            <div className="bp-modal-header">
              <div>
                <h2>Regenerate Statements?</h2>
                <p>{confirmCutoff.label}</p>
              </div>
            </div>
            <div className="bp-modal-body">
              <p className="bp-confirm-copy">
                Statements already exist for this cutoff. Regenerating will refresh existing statements for this period.
              </p>
              <div className="bp-modal-actions">
                <button className="bp-btn-secondary" type="button" onClick={() => setConfirmCutoff(null)} disabled={generating}>
                  Cancel
                </button>
                <button className="bp-btn-primary" type="button" onClick={() => executeGenerate(confirmCutoff)} disabled={generating}>
                  {generating ? 'Regenerating...' : 'Regenerate Statements'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
