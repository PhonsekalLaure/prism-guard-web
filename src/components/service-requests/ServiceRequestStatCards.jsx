import { BASE_STATS } from './serviceRequestUi';

export default function ServiceRequestStatCards({
  stats,
  loading = false,
  cards = BASE_STATS,
  className = 'stat-grid',
  style,
}) {
  if (loading) {
    return (
      <div className={className} style={style}>
        {cards.map((card, i) => (
          <div
            key={i}
            className="stat-card stat-card--skeleton"
            style={{ borderLeftColor: card.borderColor }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="dsk-line sm" />
              <div className="dsk-line xl" />
              <div className="dsk-line sm" />
            </div>
            <div
              className="dsk-icon-wrap"
              style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key || card.label}
            className="stat-card"
            style={{ borderLeftColor: card.borderColor }}
          >
            <div>
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value" style={{ color: card.valueColor }}>
                {stats?.[card.key] ?? 0}
              </h3>
              <p className="stat-sub">{card.sub}</p>
            </div>
            {Icon && (
              <div
                className="stat-icon"
                style={{
                  background: card.iconBg || `${card.borderColor}1a`,
                  color: card.iconColor || card.borderColor,
                }}
              >
                <Icon />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
