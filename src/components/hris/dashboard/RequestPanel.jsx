import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

function RequestSkeleton({ showAmount }) {
  return (
    <div
      className="request-item"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
        <SkeletonBlock height={13} width="48%" radius={4} />
        <SkeletonBlock height={28} width={64} radius={6} />
      </div>
      {showAmount ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.45rem' }}>
          <SkeletonBlock height={11} width="52%" radius={4} />
          <SkeletonBlock height={11} width={70} radius={4} />
        </div>
      ) : (
        <SkeletonBlock height={11} width="36%" radius={4} style={{ marginBottom: '0.45rem' }} />
      )}
      <SkeletonBlock height={10} width="44%" radius={4} />
    </div>
  );
}

export default function RequestPanel({
  children,
  emptyFillsPanel = false,
  emptyMessage,
  icon,
  itemCount,
  linkTo,
  loading,
  showAmountSkeleton = false,
  title,
}) {
  const compact = !loading && itemCount === 1;
  const PanelIcon = icon;

  return (
    <div
      className="panel"
      style={{
        height: compact ? 'auto' : '100%',
        alignSelf: compact ? 'start' : 'stretch',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="panel-header">
        <h3><PanelIcon /> {title}</h3>
      </div>

      <div style={{ flex: compact ? '0 0 auto' : 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <SkeletonList count={2}>{(index) => (
            <RequestSkeleton key={index} showAmount={showAmountSkeleton} />
          )}</SkeletonList>
        ) : itemCount === 0 ? (
          <div
            className="request-item"
            style={{
              ...(emptyFillsPanel ? { flex: 1, display: 'flex', alignItems: 'center' } : {}),
              color: '#64748b',
              fontSize: '0.85rem',
            }}
          >
            {emptyMessage}
          </div>
        ) : children}
      </div>

      <Link to={linkTo} className="panel-link">
        View All Requests <FaArrowRight style={{ fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
