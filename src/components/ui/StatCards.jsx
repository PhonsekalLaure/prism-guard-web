import { FaChartBar } from 'react-icons/fa';
import '../../styles/components/StatCard.css';

function resolveValue(card, stats, loading) {
  if (loading) return '...';

  if (Object.prototype.hasOwnProperty.call(card, 'value')) {
    return card.value;
  }

  const statKey = card.statKey || card.key;
  const rawValue = statKey ? stats?.[statKey] : undefined;
  const fallback = Object.prototype.hasOwnProperty.call(card, 'fallbackValue')
    ? card.fallbackValue
    : 0;
  const value = rawValue ?? fallback;

  return typeof card.format === 'function' ? card.format(value, stats) : value;
}

export default function StatCards({
  cards = [],
  stats,
  loading = false,
  className = '',
  columns,
  onCardClick,
}) {
  const gridStyle = columns ? { '--stat-grid-columns': `repeat(${columns}, minmax(0, 1fr))` } : undefined;
  const gridClassName = ['stat-grid', className].filter(Boolean).join(' ');

  return (
    <div className={gridClassName} style={gridStyle}>
      {cards.map((card, index) => {
        const Icon = card.icon || card.Icon || FaChartBar;
        const borderColor = card.borderColor || card.border || '#093269';
        const valueColor = card.valueColor || borderColor;
        const iconColor = card.iconColor || borderColor;
        const iconBg = card.iconBg || `${borderColor}1a`;
        const value = resolveValue(card, stats, loading);
        const clickable = Boolean(onCardClick || card.onClick);
        const CardTag = clickable ? 'button' : 'div';

        return (
          <CardTag
            key={card.id || card.key || card.statKey || card.label || index}
            type={clickable ? 'button' : undefined}
            className={`stat-card${clickable ? ' stat-card--clickable' : ''}`}
            style={{ borderLeftColor: borderColor, animationDelay: card.delay || `${index * 0.05}s` }}
            onClick={() => {
              if (card.onClick) {
                card.onClick(card);
              } else {
                onCardClick?.(card);
              }
            }}
            aria-label={clickable ? card.label : undefined}
          >
            <div className="stat-card__content">
              <div className="stat-card__header">
                <p className="stat-label">{card.label}</p>
                <div
                  className="stat-icon"
                  style={{ background: iconBg, color: iconColor }}
                  aria-hidden="true"
                >
                  <Icon />
                </div>
              </div>
              <p className="stat-value" style={{ color: valueColor }}>
                {value}
              </p>
              {card.sub !== undefined && card.sub !== null && (
                <p className="stat-sub" style={{ color: card.subColor }}>
                  {typeof card.sub === 'function' ? card.sub(stats, card) : card.sub}
                </p>
              )}
            </div>
          </CardTag>
        );
      })}
    </div>
  );
}
