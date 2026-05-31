import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientsTopbar from '@hris-components/clients/ClientsTopbar';
import ClientsStatCards from '@hris-components/clients/ClientsStatCards';
import ClientsFilterBar from '@hris-components/clients/ClientsFilterBar';
import ClientsGrid from '@hris-components/clients/ClientsGrid';

import clientService from '../../services/hris/clientService';
import authService from '@services/authService';
import { hasPermission } from '@utils/adminPermissions';

export default function ClientsPage() {
  const navigate            = useNavigate();
  const profile = authService.getProfile() || {};
  const canWriteClients = hasPermission(profile, 'clients.write');
  const [clients,           setClients]           = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);
  const [refreshKey,        setRefreshKey]        = useState(0);
  const [currentPage,       setCurrentPage]       = useState(1);
  const [totalItems,        setTotalItems]        = useState(0);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({ search: '', status: 'all' });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: 'all' });
    setCurrentPage(1);
  };

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        setError(null);
        const response = await clientService.getAllClients(currentPage, itemsPerPage, filters);
        setClients(response.data);
        setTotalItems(response.metadata.total);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [currentPage, filters, refreshKey]);

  return (
    <>
      <ClientsTopbar canAddClient={canWriteClients} onAddClient={() => navigate('/clients/new')} />

      <div className="dashboard-content">
        <ClientsStatCards refreshKey={refreshKey} />
        <ClientsFilterBar filters={filters} onFilterChange={handleFilterChange} />

        {error ? (
          <div className="admin-alert-box admin-alert-error" style={{ marginTop: '1rem' }}>Error loading clients: {error}</div>
        ) : (
          <ClientsGrid
            clients={clients}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onResetFilters={handleResetFilters}
            onViewClient={(client) => navigate(`/clients/${client.id}`)}
            loading={loading}
          />
        )}
      </div>

    </>
  );
}
