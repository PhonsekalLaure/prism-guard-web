import { useRef } from 'react';
import {
  FaCamera,
  FaCheckCircle,
  FaCloudUploadAlt,
} from 'react-icons/fa';
import { formatFileSize } from './billingUi';

export default function ReceiptUploadField({
  file,
  error = '',
  onChange,
  onClearError,
}) {
  const fileInputRef = useRef(null);

  const clearFile = (event) => {
    event.stopPropagation();
    onChange?.(null);
    onClearError?.();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="cms-sp-field">
      <label className="cms-sp-label">
        <FaCamera className="cms-sp-label-icon" /> Upload Proof of Payment
      </label>

      <div
        className={`cms-sp-upload-zone${file ? ' cms-sp-upload-zone--selected' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => !file && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !file && fileInputRef.current?.click()}
      >
        {file ? (
          <FaCheckCircle className="cms-sp-upload-icon cms-sp-upload-icon--check" />
        ) : (
          <FaCloudUploadAlt className="cms-sp-upload-icon" />
        )}

        {file ? (
          <>
            <p className="cms-sp-upload-text cms-sp-upload-text--file">{file.name}</p>
            <p className="cms-sp-upload-hint">
              {file.type === 'application/pdf' ? 'PDF' : file.type.split('/')[1]?.toUpperCase()}
              &nbsp;&middot;&nbsp;
              {formatFileSize(file.size)}
            </p>
            <div className="cms-sp-upload-file-actions">
              <button
                type="button"
                className="cms-sp-upload-change-btn"
                onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Change
              </button>
              <button
                type="button"
                className="cms-sp-upload-remove-btn"
                onClick={clearFile}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="cms-sp-upload-text">Click to browse or drop a file here</p>
            <p className="cms-sp-upload-hint">JPG, PNG, or PDF up to 10MB</p>
          </>
        )}
      </div>

      {error && <p className="cms-sp-error">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        onChange={(event) => onChange?.(event.target.files?.[0] || null)}
      />
    </div>
  );
}
