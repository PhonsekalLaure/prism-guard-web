import { createElement } from 'react';

export function SkeletonBlock({
  as = 'div',
  className = '',
  width,
  height,
  radius,
  style,
}) {
  const styles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(radius ? { borderRadius: radius } : {}),
    ...style,
  };

  return createElement(as, {
    className: `skeleton-block-base ${className}`.trim(),
    style: styles,
  });
}

export function TableSkeletonRows({ rows = 5, columns = 5, getCellClassName, getCellStyle }) {
  return <SkeletonList count={rows}>{(rowIndex) => (
    <tr key={rowIndex} className="table-skeleton-row">
      <SkeletonList count={columns}>{(columnIndex) => (
        <td key={columnIndex}>
          <SkeletonBlock
            className={getCellClassName?.(columnIndex, rowIndex) || 'table-skeleton-line'}
            style={getCellStyle?.(columnIndex, rowIndex)}
          />
        </td>
      )}</SkeletonList>
    </tr>
  )}</SkeletonList>;
}

export function SkeletonList({ count, children }) {
  return Array.from({ length: count }, (_, index) => children(index));
}

export function EntityCardSkeleton({ variant = 'employee' }) {
  if (variant === 'applicant') {
    return (
      <div className="applicant-card entity-card-skeleton entity-card-skeleton--applicant">
        <div className="applicant-card-body entity-card-skeleton__body">
          <div className="applicant-card-top">
            <div className="applicant-top-left">
              <SkeletonBlock className="entity-card-skeleton__avatar" />
              <div className="entity-card-skeleton__lines">
                <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long" />
                <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short" />
              </div>
            </div>
            <SkeletonBlock className="entity-card-skeleton__badge" />
          </div>
          <SkeletonBlock className="entity-card-skeleton__body-line" />
          <SkeletonBlock className="entity-card-skeleton__body-line" />
          <SkeletonBlock className="entity-card-skeleton__body-line entity-card-skeleton__body-line--short" />
          <div className="entity-card-skeleton__tag-row">
            <SkeletonBlock className="entity-card-skeleton__tag" />
            <SkeletonBlock className="entity-card-skeleton__tag" />
          </div>
          <SkeletonBlock className="entity-card-skeleton__body-line entity-card-skeleton__body-line--short" />
        </div>
      </div>
    );
  }

  if (variant === 'client') {
    return (
      <div className="client-card entity-card-skeleton entity-card-skeleton--client">
        <div className="client-card-header entity-card-skeleton__client-header">
          <SkeletonBlock 
            className="entity-card-skeleton__avatar entity-card-skeleton__avatar--square entity-card-skeleton__light" 
            style={{ marginBottom: '0.55rem' }}
          />
          <div className="entity-card-skeleton__lines">
            <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long entity-card-skeleton__light" />
            <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short entity-card-skeleton__light" />
          </div>
        </div>
        <div className="client-card-body entity-card-skeleton__body">
          <SkeletonBlock className="entity-card-skeleton__body-line" />
          <SkeletonBlock className="entity-card-skeleton__body-line" />
          <SkeletonBlock className="entity-card-skeleton__body-line entity-card-skeleton__body-line--short" />
        </div>
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div className="admin-card entity-card-skeleton entity-card-skeleton--admin">
        <SkeletonBlock className="entity-card-skeleton__admin-header" />
        <div className="admin-card-body entity-card-skeleton__body">
          <div className="admin-card-user">
            <SkeletonBlock className="entity-card-skeleton__avatar" />
            <div className="entity-card-skeleton__lines">
              <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long" />
              <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short" />
            </div>
          </div>
          <SkeletonBlock className="entity-card-skeleton__body-line" />
          <SkeletonBlock className="entity-card-skeleton__body-line entity-card-skeleton__body-line--short" />
        </div>
      </div>
    );
  }

  return (
    <div className="employee-card entity-card-skeleton entity-card-skeleton--employee">
      <div className="employee-card-body entity-card-skeleton__body">
        <div className="employee-card-header-row">
          <div className="employee-header-left">
            <SkeletonBlock className="entity-card-skeleton__avatar" />
            <div className="entity-card-skeleton__lines">
              <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long" />
              <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short" />
            </div>
          </div>
          <SkeletonBlock className="entity-card-skeleton__badge" />
        </div>
        <SkeletonBlock className="entity-card-skeleton__body-line" />
        <SkeletonBlock className="entity-card-skeleton__body-line" />
        <SkeletonBlock className="entity-card-skeleton__body-line entity-card-skeleton__body-line--short" />
      </div>
    </div>
  );
}

export function IncidentCardSkeleton({ detailColumns = 3, showSummary = false, delay }) {
  return (
    <div className="incident-card-skeleton" style={delay ? { animationDelay: delay } : undefined}>
      <div className="incident-card-skeleton__header">
        <div className="incident-card-skeleton__left">
          <SkeletonBlock className="incident-card-skeleton__icon" />
          <div className="incident-card-skeleton__lines">
            <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__line--eyebrow" />
            <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__line--title" />
            <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__line--meta" />
          </div>
        </div>
        <div className="incident-card-skeleton__right">
          <SkeletonBlock className="incident-card-skeleton__pill" />
          <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__line--time" />
        </div>
      </div>

      <div className="incident-card-skeleton__details" style={{ gridTemplateColumns: `repeat(${detailColumns}, 1fr)` }}>
        <SkeletonList count={detailColumns}>{(index) => (
          <div key={index} className="incident-card-skeleton__detail">
            <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__detail-label" />
            <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__detail-value" />
          </div>
        )}</SkeletonList>
      </div>

      {showSummary && (
        <div className="incident-card-skeleton__summary">
          <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__summary-label" />
          <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__summary-line" />
          <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__summary-line incident-card-skeleton__summary-line--short" />
        </div>
      )}

      <div className="incident-card-skeleton__footer">
        <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__footer-line" />
        <SkeletonBlock className="incident-card-skeleton__line incident-card-skeleton__footer-line incident-card-skeleton__footer-line--wide" />
      </div>
    </div>
  );
}
