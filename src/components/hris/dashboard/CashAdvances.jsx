import { FaHandHoldingUsd, FaRegClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RequestPanel from './RequestPanel';

export default function CashAdvances({ advances, loading }) {
  const navigate = useNavigate();
  const rows = advances?.data || [];

  return (
    <RequestPanel
      emptyFillsPanel
      emptyMessage="No pending cash advances."
      icon={FaHandHoldingUsd}
      itemCount={rows.length}
      linkTo="/cash-advance"
      loading={loading}
      showAmountSkeleton
      title="Pending Cash Advances"
    >
      {rows.map((advance, index) => (
        <div
          key={advance.id}
          className="request-item"
          style={{
            flex: rows.length > 1 ? 1 : '0 0 auto',
            minHeight: '112px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderBottom: index < rows.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <p className="req-name">{advance.name}</p>
            <button className="review-btn" onClick={() => navigate(`/cash-advance/${advance.id}`)} type="button">
              Review
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
            <p className="req-type">{advance.reason}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#093269', margin: 0 }}>
              {advance.amountRequestedLabel}
            </p>
          </div>
          <p className="req-time"><FaRegClock style={{ marginRight: 4 }} />{advance.statusMeta}</p>
        </div>
      ))}
    </RequestPanel>
  );
}
