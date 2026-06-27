import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HrisAttendanceTopbar from '@hris-components/attendance/HrisAttendanceTopbar';
import HrisAttendanceStatCards from '@hris-components/attendance/HrisAttendanceStatCards';
import HrisAttendanceFilterBar from '@hris-components/attendance/HrisAttendanceFilterBar';
import HrisAttendanceReviewQueue from '@hris-components/attendance/HrisAttendanceReviewQueue';
import HrisAttendanceTable from '@hris-components/attendance/HrisAttendanceTable';
import attendanceService from '@services/hris/attendanceService';
import '../../styles/hris/HrisAttendance.css';

const DEFAULT_FILTERS = { search: '', clientId: 'all', status: 'all' };
const DEFAULT_METADATA = { total: 0, page: 1, limit: 8, totalPages: 1 };

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function HrisAttendancePage() {
  const [searchParams] = useSearchParams();
  const requestedAttendanceLogId = searchParams.get('attendanceLogId');
  const requestedContestId = searchParams.get('contestId');
  const requestedDate = searchParams.get('date');
  const requestedStatus = searchParams.get('status');
  const today = getTodayDateString();
  const initialDate = useMemo(() => (
    requestedDate && requestedDate <= today ? requestedDate : today
  ), [requestedDate, today]);
  const initialFilters = useMemo(() => ({
    ...DEFAULT_FILTERS,
    status: requestedStatus || DEFAULT_FILTERS.status,
  }), [requestedStatus]);
  const [records, setRecords] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [reviewQueue, setReviewQueue] = useState(null);
  const [reviewQueueLoading, setReviewQueueLoading] = useState(true);
  const [reviewQueueError, setReviewQueueError] = useState(null);
  const [requestedReview, setRequestedReview] = useState({
    attendanceLogId: requestedAttendanceLogId,
    contestId: requestedContestId,
    key: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (
    page = 1,
    currentFilters = DEFAULT_FILTERS,
    date = getTodayDateString()
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await attendanceService.getAttendanceRecords({
        page,
        limit: 8,
        date,
        ...currentFilters,
      });
      setRecords(result.data || []);
      setMetadata(result.metadata || { total: 0, page, limit: 8, totalPages: 1 });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load attendance records.');
      setRecords([]);
      setMetadata({ ...DEFAULT_METADATA, page });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (currentFilters = DEFAULT_FILTERS, date = getTodayDateString()) => {
    try {
      setLoadingStats(true);
      const result = await attendanceService.getStats({
        date,
        ...currentFilters,
      });
      setStats(result);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, []);


  const fetchReviewQueue = useCallback(async () => {
    try {
      setReviewQueueLoading(true);
      setReviewQueueError(null);
      const result = await attendanceService.getAttendanceReviews();
      setReviewQueue(result);
    } catch (err) {
      setReviewQueue(null);
      setReviewQueueError(err?.response?.data?.error || 'Failed to load attendance review queue.');
    } finally {
      setReviewQueueLoading(false);
    }
  }, []);
  const fetchClients = useCallback(async () => {
    try {
      const result = await attendanceService.getClients();
      setClients(result || []);
    } catch {
      setClients([]);
    }
  }, []);

  useEffect(() => {
    fetchRecords(1, initialFilters, initialDate);
    fetchStats(initialFilters, initialDate);
    fetchClients();
    fetchReviewQueue();
  }, [fetchRecords, fetchStats, fetchClients, fetchReviewQueue, initialDate, initialFilters]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      fetchRecords(metadata.page || 1, filters, selectedDate);
      fetchStats(filters, selectedDate);
      fetchClients();
      fetchReviewQueue();
    }, 60000);

    return () => window.clearInterval(refreshTimer);
  }, [fetchRecords, fetchStats, fetchClients, fetchReviewQueue, filters, metadata.page, selectedDate]);

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    fetchRecords(1, nextFilters, selectedDate);
    fetchStats(nextFilters, selectedDate);
  }, [fetchRecords, fetchStats, selectedDate]);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelectedDate(today);
    fetchRecords(1, DEFAULT_FILTERS, today);
    fetchStats(DEFAULT_FILTERS, today);
  }, [fetchRecords, fetchStats, today]);

  const handleDateChange = useCallback((nextDate) => {
    const safeDate = nextDate && nextDate <= today ? nextDate : today;
    setSelectedDate(safeDate);
    fetchRecords(1, filters, safeDate);
    fetchStats(filters, safeDate);
  }, [fetchRecords, fetchStats, filters, today]);

  const handlePageChange = useCallback((page) => {
    fetchRecords(page, filters, selectedDate);
  }, [fetchRecords, filters, selectedDate]);

  const handleRefresh = useCallback(() => {
    fetchRecords(metadata.page || 1, filters, selectedDate);
    fetchStats(filters, selectedDate);
    fetchClients();
    fetchReviewQueue();
  }, [fetchRecords, fetchStats, fetchClients, fetchReviewQueue, filters, metadata.page, selectedDate]);


  const handleOpenReview = useCallback((review) => {
    if (!review?.date) return;
    const status = review.type === 'attendance_contest' ? 'attendance_contest' : 'missed_clock_out';
    const nextFilters = { ...filters, status };

    setSelectedDate(review.date);
    setFilters(nextFilters);
    setRequestedReview((current) => ({
      attendanceLogId: review.attendanceLogId || null,
      contestId: review.contestId || null,
      key: current.key + 1,
    }));
    fetchRecords(1, nextFilters, review.date);
    fetchStats(nextFilters, review.date);
  }, [fetchRecords, fetchStats, filters]);
  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      setError(null);
      const result = await attendanceService.exportReport({
        date: selectedDate,
        ...filters,
      });
      downloadBlob(result.blob, result.filename || `attendance-${selectedDate}.csv`);
    } catch {
      setError('Failed to export attendance report.');
    } finally {
      setExporting(false);
    }
  }, [selectedDate, filters]);

  return (
    <>
      <HrisAttendanceTopbar
        date={selectedDate}
        loading={loading || loadingStats}
        exporting={exporting}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <div className="dashboard-content">
        <HrisAttendanceStatCards stats={stats} loading={loadingStats} />
        <HrisAttendanceReviewQueue
          reviews={reviewQueue?.reviews || []}
          metadata={reviewQueue}
          loading={reviewQueueLoading}
          error={reviewQueueError}
          onRefresh={fetchReviewQueue}
          onOpenReview={handleOpenReview}
        />
        <HrisAttendanceFilterBar
          clients={clients}
          filters={filters}
          selectedDate={selectedDate}
          maxDate={today}
          onDateChange={handleDateChange}
          onFilterChange={handleFilterChange}
        />
        {error && (
          <div className="ha-error-banner">{error}</div>
        )}
        <HrisAttendanceTable
          records={records}
          metadata={metadata}
          loading={loading}
          selectedDate={selectedDate}
          onRefresh={handleRefresh}
          onPageChange={handlePageChange}
          onResetFilters={handleResetFilters}
          requestedAttendanceLogId={requestedReview.attendanceLogId}
          requestedContestId={requestedReview.contestId}
          requestedReviewKey={requestedReview.key}
        />
      </div>
    </>
  );
}
