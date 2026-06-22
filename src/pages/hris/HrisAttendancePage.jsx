import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HrisAttendanceTopbar from '@hris-components/attendance/HrisAttendanceTopbar';
import HrisAttendanceStatCards from '@hris-components/attendance/HrisAttendanceStatCards';
import HrisAttendanceFilterBar from '@hris-components/attendance/HrisAttendanceFilterBar';
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
  const today = getTodayDateString();
  const [records, setRecords] = useState([]);
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (
    page = 1,
    currentFilters = DEFAULT_FILTERS,
    date = selectedDate
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
  }, [selectedDate]);

  const fetchStats = useCallback(async (currentFilters = DEFAULT_FILTERS, date = selectedDate) => {
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
  }, [selectedDate]);

  const fetchClients = useCallback(async () => {
    try {
      const result = await attendanceService.getClients();
      setClients(result || []);
    } catch {
      setClients([]);
    }
  }, []);

  useEffect(() => {
    fetchRecords(1, DEFAULT_FILTERS);
    fetchStats(DEFAULT_FILTERS);
    fetchClients();
  }, [fetchRecords, fetchStats, fetchClients]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      fetchRecords(metadata.page || 1, filters);
      fetchStats(filters);
      fetchClients();
    }, 60000);

    return () => window.clearInterval(refreshTimer);
  }, [fetchRecords, fetchStats, fetchClients, filters, metadata.page]);

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    fetchRecords(1, nextFilters);
    fetchStats(nextFilters);
  }, [fetchRecords, fetchStats]);

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
    fetchRecords(page, filters);
  }, [fetchRecords, filters]);

  const handleRefresh = useCallback(() => {
    fetchRecords(metadata.page || 1, filters);
    fetchStats(filters);
    fetchClients();
  }, [fetchRecords, fetchStats, fetchClients, filters, metadata.page]);

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
          requestedAttendanceLogId={requestedAttendanceLogId}
          requestedContestId={requestedContestId}
        />
      </div>
    </>
  );
}
