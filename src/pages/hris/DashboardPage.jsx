import { useEffect, useState } from 'react';
import Topbar from '@hris-components/dashboard/Topbar';
import StatCards from '@hris-components/dashboard/StatCards';
import IncidentFeed from '@hris-components/dashboard/IncidentFeed';
import ManpowerTable from '@hris-components/dashboard/ManpowerTable';
import LeaveRequests from '@hris-components/dashboard/LeaveRequests';
import CashAdvances from '@hris-components/dashboard/CashAdvances';
import dashboardService from '@services/hris/dashboardService';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <>
      <Topbar />

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
