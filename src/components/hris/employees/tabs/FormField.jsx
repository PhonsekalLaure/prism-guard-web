/* Reusable form field used across all AddEmployee wizard steps */
export default function FormField({
  label, type, options, placeholder, required, hint,
  value, onChange, readOnly, disabled, span2, prefix,
}) {
  const wrapClass = `ae-form-group ${span2 ? 'span-2' : ''}`;

  if (type === 'select') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <select className="ae-input" required={required} value={value} onChange={onChange} disabled={disabled}>
          {options?.map((opt) => {
            const isObj = typeof opt === 'object';
            const val   = isObj ? opt.value : opt;
            const lbl   = isObj ? opt.label  : opt;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <textarea
          className="ae-input ae-textarea"
          rows="2"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {hint && <p className="ae-hint">{hint}</p>}
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <label>{label}</label>
      <div className={prefix ? 'ae-input-prefix-wrap' : undefined}>
        {prefix && <span className="ae-prefix">{prefix}</span>}
        <input
          type={type}
          className={`ae-input ${readOnly ? 'ae-readonly' : ''} ${prefix ? 'ae-has-prefix' : ''}`}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
      {hint && <p className="ae-hint">{hint}</p>}
    </div>
  );
}
