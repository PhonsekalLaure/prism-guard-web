import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import BillingTopbar from '@hris-components/billing/BillingTopbar';
import BillingStatCards from '@hris-components/billing/BillingStatCards';
import BillingFilterBar from '@hris-components/billing/BillingFilterBar';
import BillingTable from '@hris-components/billing/BillingTable';
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
  const [confirmCutoff, setConfirmCutoff] = useState(null);
  const skipNextFilterLoadRef = useRef(false);
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
      setRecords(result.data || []);
      setMetadata(result.metadata || { ...DEFAULT_METADATA, page });
    } catch (error) {
      setRecords([]);
      setMetadata({ ...DEFAULT_METADATA, page });
      showNotification(getErrorMessage(error, 'Failed to load billing statements.'), 'error');
    } finally {
      if (!silent) setLoading(false);
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
    run: (cutoff) => billingService.generateStatements({
      period_start: cutoff.periodStart,
      period_end: cutoff.periodEnd,
    }),
    afterSuccess: async (_result, cutoff) => {
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
      await generateStatementsAction.execute(cutoff);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to check existing billing statements.'), 'error');
    } finally {
      setCheckingGeneration(false);
    }
  };

  const handleConfirmRegenerate = async () => {
    if (!confirmCutoff) return;
    const result = await generateStatementsAction.execute(confirmCutoff);
    if (result) setConfirmCutoff(null);
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
        open={Boolean(confirmCutoff)}
        title="Regenerate Statements?"
        description={confirmCutoff
          ? `Statements already exist for ${confirmCutoff.label}. Regenerating will refresh existing statements for this period.`
          : ''}
        confirmLabel="Regenerate Statements"
        loading={generateStatementsAction.loading}
        tone="warning"
        onCancel={() => setConfirmCutoff(null)}
        onConfirm={handleConfirmRegenerate}
      />
    </>
  );
}
