import { useEffect, useState } from 'react';
import Notification from '@components/ui/Notification';
import Topbar from '@hris-components/dashboard/Topbar';
import StatCards from '@hris-components/dashboard/StatCards';
import IncidentFeed from '@hris-components/dashboard/IncidentFeed';
import ManpowerTable from '@hris-components/dashboard/ManpowerTable';
import LeaveRequests from '@hris-components/dashboard/LeaveRequests';
import CashAdvances from '@hris-components/dashboard/CashAdvances';
import {
  buildDashboardReportCsv,
  buildDashboardReportFilename,
} from '@hris-components/dashboard/dashboardReport';
import useNotification from '@hooks/useNotification';
import dashboardService from '@services/hris/dashboardService';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const data = await dashboardService.getDashboardSummary();
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || err.message || 'Failed to load dashboard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const access = summary?.access || {};
  const widgetErrors = Object.values(summary?.errors || {}).filter(Boolean);

  const handleExportReport = async () => {
    if (!summary || loading || exporting) return;

    let downloadUrl = '';
    let link = null;

    try {
      setExporting(true);
      await Promise.resolve();

      const generatedAt = new Date();
      const csv = buildDashboardReportCsv(summary, generatedAt);
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      downloadUrl = URL.createObjectURL(blob);
      link = document.createElement('a');
      link.href = downloadUrl;
      link.download = buildDashboardReportFilename(generatedAt);
      document.body.appendChild(link);
      link.click();
    } catch {
      showNotification('Failed to export dashboard report.', 'error');
    } finally {
      link?.remove();
      if (downloadUrl) {
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
      }
      setExporting(false);
    }
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

      <Topbar
        exporting={exporting}
        exportDisabled={loading || !summary}
        onExport={handleExportReport}
      />

      <div className="dashboard-content">
        {access.attendance !== false && <StatCards stats={summary?.stats} loading={loading} />}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {!error && widgetErrors.length > 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1rem', color: '#92400e', fontSize: '0.85rem' }}>
            {widgetErrors.join(' ')}
          </div>
        )}

        <div className="content-grid">
          {access.incidents !== false && <IncidentFeed incidents={summary?.incidents} loading={loading} />}
          {access.leaves !== false && <LeaveRequests requests={summary?.leaveRequests} loading={loading} />}
          {access.manpower !== false && <ManpowerTable manpower={summary?.manpower} loading={loading} />}
          {access.cashAdvances !== false && <CashAdvances advances={summary?.cashAdvances} loading={loading} />}
        </div>
      </div>
    </>
  );
}
