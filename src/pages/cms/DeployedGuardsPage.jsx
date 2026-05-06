import { useState, useEffect, useCallback } from 'react';
import DeployedGuardsTopbar from '@cms-components/deployed-guards/DeployedGuardsTopbar';
import DeployedGuardsStatCards from '@cms-components/deployed-guards/DeployedGuardsStatCards';
import DeployedGuardsFilterBar from '@cms-components/deployed-guards/DeployedGuardsFilterBar';
import GuardRosterTable from '@cms-components/deployed-guards/GuardRosterTable';
import GuardDetailModal from '@cms-components/deployed-guards/GuardDetailModal';
import deployedGuardsService from '@services/cms/deployedGuardsService';

const LIMIT = 6;

export default function DeployedGuardsPage() {
  // ── Stats ──────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Guard list ─────────────────────────────────────────────────────────────
  const [guards, setGuards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [listLoading, setListLoading] = useState(true);

  // ── Filters ────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({ search: '', shift: 'all', status: 'all' });

  // ── Guard detail modal ─────────────────────────────────────────────────────
  const [selectedGuard, setSelectedGuard] = useState(null);   // summary row from table
  const [guardDetail, setGuardDetail] = useState(null);        // full detail from API
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch stats ────────────────────────────────────────────────────────────
  useEffect(() => {
    setStatsLoading(true);
    deployedGuardsService.getDeployedGuardsStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch guard list ───────────────────────────────────────────────────────
  const fetchGuards = useCallback(() => {
    setListLoading(true);
    deployedGuardsService.getAllDeployedGuards(currentPage, LIMIT, {
      search: filters.search || null,
      shift: filters.shift !== 'all' ? filters.shift : null,
      status: filters.status !== 'all' ? filters.status : null,
    })
      .then((res) => {
        setGuards(res.data || []);
        setTotalCount(res.metadata?.total || 0);
        setTotalPages(res.metadata?.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setListLoading(false));
  }, [currentPage, filters]);

  useEffect(() => {
    fetchGuards();
  }, [fetchGuards]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleViewGuard = async (guard) => {
    setSelectedGuard(guard);
    setGuardDetail(null);
    setDetailLoading(true);
    try {
      const detail = await deployedGuardsService.getDeployedGuardDetails(guard.id);
      setGuardDetail(detail);
    } catch (err) {
      console.error('Failed to load guard detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedGuard(null);
    setGuardDetail(null);
  };

  return (
    <>
      <DeployedGuardsTopbar />

      <div className="cms-content">
        <DeployedGuardsStatCards stats={stats} loading={statsLoading} />
        <DeployedGuardsFilterBar onFilterChange={handleFilterChange} />
        <GuardRosterTable
          guards={guards}
          loading={listLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={LIMIT}
          onPageChange={setCurrentPage}
          onViewGuard={handleViewGuard}
        />
      </div>

      <GuardDetailModal
        isOpen={!!selectedGuard}
        guard={guardDetail}
        loading={detailLoading}
        onClose={handleCloseModal}
      />
    </>
  );
}