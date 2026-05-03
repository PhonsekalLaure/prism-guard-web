/* ─────────────────────────────────────────────────────────
   Shared reusable primitives used across all employee tabs
───────────────────────────────────────────────────────── */

export function EditInput({ label, value, onChange, type = 'text', placeholder, readOnly = false, disabled = false, min, max }) {
  return (
    <div className="ve-edit-field">
      <label className="ve-edit-label">{label}</label>
      <input
        type={type}
        className="ve-edit-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        readOnly={readOnly}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  );
}

export function EditSelect({ label, value, onChange, options }) {
  return (
    <div className="ve-edit-field">
      <label className="ve-edit-label">{label}</label>
      <select className="ve-edit-input" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

export function InfoCell({ label, value, variant, span2, span3, valueColor, valueSize }) {
  const cellClass = [
    've-info-cell',
    variant === 'blue'  ? 'blue'   : '',
    variant === 'green' ? 'green'  : '',
    span2               ? 'span-2' : '',
    span3               ? 'span-3' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClass}>
      <p className="ve-info-label">{label}</p>
      <p className={`ve-info-value ${valueSize === 'xl' ? 'xl' : ''}`} style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
    </div>
  );
}
