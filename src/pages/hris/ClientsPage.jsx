import { useState, useEffect } from 'react';
import ClientsTopbar from '@hris-components/clients/ClientsTopbar';
import ClientsStatCards from '@hris-components/clients/ClientsStatCards';
import ClientsFilterBar from '@hris-components/clients/ClientsFilterBar';
import ClientsGrid from '@hris-components/clients/ClientsGrid';
import ViewClientModal from '@hris-components/clients/ViewClientModal';
import AddClientModal from '@hris-components/clients/AddClientModal';
import clientService from '../../services/clientService';

export default function ClientsPage() {
  const [viewClient, setViewClient] = useState(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all'
    });
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
      <ClientsTopbar onAddClient={() => setIsAddClientOpen(true)} />

      <div className="dashboard-content">
        <ClientsStatCards refreshKey={refreshKey} />
        <ClientsFilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">Error loading clients: {error}</div>
        ) : (
          <ClientsGrid 
            clients={clients} 
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onResetFilters={handleResetFilters}
            onViewClient={(client) => setViewClient(client)} 
          />
        )}
      </div>

      <ViewClientModal
        isOpen={!!viewClient}
        client={viewClient}
        onClose={() => setViewClient(null)}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
    </>
  );
}
