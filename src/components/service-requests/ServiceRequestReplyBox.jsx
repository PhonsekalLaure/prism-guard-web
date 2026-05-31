import { FaPaperPlane } from 'react-icons/fa';

export default function ServiceRequestReplyBox({
  label = 'Reply',
  value,
  onChange,
  onSend,
  loading = false,
  error,
  placeholder,
  buttonClassName = 'sr-modal-btn blue',
}) {
  return (
    <div className="sr-reply-box">
      <label className="sr-reply-label">{label}</label>
      <textarea
        className="sr-reply-textarea"
        rows={3}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={loading}
        placeholder={placeholder}
      />
      {error && <p className="sr-field-error">{error}</p>}
      <div className="sr-reply-actions">
        <span />
        <button
          type="button"
          className={buttonClassName}
          onClick={onSend}
          disabled={loading}
        >
          <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
}
