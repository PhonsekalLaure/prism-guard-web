import { BASE_STATS } from './serviceRequestUi';
import StatCards from '@components/ui/StatCards';

export default function ServiceRequestStatCards({
  stats,
  loading = false,
  cards = BASE_STATS,
  className = 'stat-grid',
  columns,
}) {
  return <StatCards cards={cards} stats={stats} loading={loading} className={className.replace('stat-grid', '').trim()} columns={columns} />;
}
