import { createElement } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../../styles/components/EmptyState.css';

export default function EmptyState({
  icon = FaSearch,
  title = 'No records found',
  description = 'We could not find any records matching your current search or filter criteria. Try adjusting your settings or reset to view all records.',
  actionLabel,
  onAction,
  className = '',
  compact = false,
}) {
  const classes = [
    'empty-state',
    compact ? 'empty-state--compact' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="empty-state-icon">
        {createElement(icon)}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="empty-state-reset">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
