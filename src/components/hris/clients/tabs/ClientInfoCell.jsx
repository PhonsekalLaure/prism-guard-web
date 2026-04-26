/* Shared helpers */
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

export const fmtMoney = (v) =>
  v == null ? 'N/A' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v);

/* InfoCell primitive */
export function InfoCell({ label, value, variant, span2, valueColor, valueSize }) {
  const cellClass = [
    'vc-info-cell',
    variant === 'blue'  ? 'blue'   : '',
    variant === 'green' ? 'green'  : '',
    span2               ? 'span-2' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClass}>
      <p className="vc-info-label">{label}</p>
      <p
        className={`vc-info-value ${valueSize === 'xl' ? 'xl' : ''}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
