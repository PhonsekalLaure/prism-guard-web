import { useCallback, useEffect, useState } from 'react';
import HrisAttendanceTopbar from '@hris-components/attendance/HrisAttendanceTopbar';
import HrisAttendanceStatCards from '@hris-components/attendance/HrisAttendanceStatCards';
import HrisAttendanceFilterBar from '@hris-components/attendance/HrisAttendanceFilterBar';
import HrisAttendanceTable from '@hris-components/attendance/HrisAttendanceTable';
import attendanceService from '@services/hris/attendanceService';
import '../../styles/hris/HrisAttendance.css';

const DEFAULT_FILTERS = { search: '', clientId: 'all', status: 'all' };

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HrisAttendancePage() {
  const [records, setRecords] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const date = getTodayDateString();

  const fetchRecords = useCallback(async (page = 1, currentFilters = DEFAULT_FILTERS) => {
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
    } finally {
      setLoading(false);
    }
  }, [date]);

  const fetchStats = useCallback(async (currentFilters = DEFAULT_FILTERS) => {
    try {
      setLoadingStats(true);
      const result = await attendanceService.getStats({
        date,
        clientId: currentFilters.clientId,
      });
      setStats(result);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, [date]);

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

  const handlePageChange = useCallback((page) => {
    fetchRecords(page, filters);
  }, [fetchRecords, filters]);

  const handleRefresh = useCallback(() => {
    fetchRecords(metadata.page || 1, filters);
    fetchStats(filters);
    fetchClients();
  }, [fetchRecords, fetchStats, fetchClients, filters, metadata.page]);

  return (
    <>
      <HrisAttendanceTopbar
        date={date}
        loading={loading || loadingStats}
        onRefresh={handleRefresh}
      />

      <div className="dashboard-content">
        <HrisAttendanceStatCards stats={stats} loading={loadingStats} />
        <HrisAttendanceFilterBar
          clients={clients}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {error && (
          <div className="ha-error-banner">{error}</div>
        )}
        <HrisAttendanceTable
          records={records}
          metadata={metadata}
          loading={loading}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
