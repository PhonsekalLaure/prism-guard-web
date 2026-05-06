import { useState, useEffect } from 'react';
import CmsTopbar from '@cms-components/dashboard/CmsTopbar';
import CmsStatCards from '@cms-components/dashboard/CmsStatCards';
import RecentIncidents from '@cms-components/dashboard/RecentIncidents';
import RecentServiceRequests from '@cms-components/dashboard/RecentServiceRequests';
import UpcomingBilling from '@cms-components/dashboard/UpcomingBilling';
import ContractOverview from '@cms-components/dashboard/ContractOverview';
import dashboardService from '@services/cms/dashboardService';

export default function CmsDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSummary() {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardSummary();
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || err.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <CmsTopbar companyName={summary?.company_name} loading={loading} />
      <div className="cms-content">
        <CmsStatCards stats={summary?.stats} loading={loading} />
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem 1.1rem', marginBottom: '1.2rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
            {error}
          </div>
        )}
        <div className="cms-grid">
          <div className="cms-left-col">
            <RecentIncidents incidents={summary?.recent_incidents} loading={loading} />
            <RecentServiceRequests requests={summary?.recent_service_requests} loading={loading} />
          </div>
          <div className="cms-right-col">
            <UpcomingBilling billing={summary?.upcoming_billing} loading={loading} />
            <ContractOverview overview={summary?.contract_overview} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}