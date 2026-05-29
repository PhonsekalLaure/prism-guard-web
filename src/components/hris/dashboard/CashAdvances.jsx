import { useEffect, useState } from 'react';
import { FaHandHoldingUsd, FaRegClock, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import cashAdvanceService from '@services/hris/cashAdvanceService';

export default function CashAdvances() {
  const navigate = useNavigate();
  const [advances, setAdvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPendingAdvances = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await cashAdvanceService.getCashAdvances({
          status: 'pending',
          page: 1,
          limit: 2,
        });
        if (mounted) setAdvances(response.data || []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.error || err.message || 'Failed to load cash advances.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPendingAdvances();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <h3><FaHandHoldingUsd /> Pending Cash Advances</h3>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div className="request-item" style={{ flex: 1, display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
            Loading pending requests...
          </div>
        ) : error ? (
          <div className="request-item" style={{ flex: 1, display: 'flex', alignItems: 'center', color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </div>
        ) : advances.length === 0 ? (
          <div className="request-item" style={{ flex: 1, display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
            No pending cash advances.
          </div>
        ) : (
          advances.map((advance, index, rows) => (
            <div
              key={advance.id}
              className="request-item"
              style={{
                flex: 1,
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
          ))
        )}
      </div>

      <Link to="/cash-advance" className="panel-link">
        View All Requests <FaArrowRight style={{ marginLeft: 4, fontSize: '0.7rem' }} />
      </Link>
    </div>
  );
}
