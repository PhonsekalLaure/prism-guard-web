const generalDocs  = [
  { id: 'valid_id',                   label: 'Valid ID' },
  { id: 'resume',                     label: 'Resume' },
  { id: 'personal_information_sheet', label: 'Personal Information Sheet' },
];

const clearanceDocs = [
  { id: 'barangay', label: 'Barangay Clearance' },
  { id: 'police',   label: 'Police Clearance' },
  { id: 'nbi',      label: 'NBI Clearance' },
  { id: 'neuro',    label: 'Neuro-Psychiatric Exam' },
  { id: 'drugtest', label: 'Drug Test' },
];

const licenseDocs = [
  { id: 'sg_license', label: 'Security Guard License (LTOPF / ID)' },
];

function DocRow({ doc, disabled = false, documents, onChange }) {
  const file = documents[doc.id];
  return (
    <div className={`ae-check-item flex items-center justify-between ${disabled ? 'ae-doc-disabled' : ''}`}>
      <span className="font-semibold text-sm">{doc.label}</span>
      <div className="flex items-center gap-2">
        {file && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded truncate max-w-[150px]">{file.name}</span>}
        <label className={`ae-btn ae-btn-secondary !py-1 !px-3 !text-xs cursor-pointer m-0 inline-block ${disabled ? 'ae-upload-disabled' : ''}`}>
          {file ? 'Change' : 'Upload'}
          <input
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            disabled={disabled}
            onChange={(e) => onChange(doc.id, e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
}

export default function Step3Documents({ data, onChange }) {
  const isFloating = !data.initialSiteId;

  const handleFileChange = (id, file) => {
    onChange('documents', { ...data.documents, [id]: file });
  };

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Requirements &amp; File Uploads</h3>
      <p className="ae-hint mb-4">Attach image or PDF files for employee documents, clearances, and contracts.</p>

      <div className="ae-doc-section">
        <div className="ae-doc-section-header">
          <span className="ae-doc-section-title">📄 General Documents</span>
        </div>
        <div className="ae-checklist">
          {generalDocs.map((doc) => <DocRow key={doc.id} doc={doc} documents={data.documents} onChange={handleFileChange} />)}
        </div>
      </div>

      <div className="ae-doc-section">
        <div className="ae-doc-section-header">
          <span className="ae-doc-section-title">🛡️ Clearances &amp; Exams</span>
          <span className="ae-doc-section-hint">Auto-renewed every year</span>
        </div>
        <div className="ae-checklist">
          {clearanceDocs.map((doc) => <DocRow key={doc.id} doc={doc} documents={data.documents} onChange={handleFileChange} />)}
        </div>
      </div>

      <div className="ae-doc-section">
        <div className="ae-doc-section-header">
          <span className="ae-doc-section-title">🪪 License</span>
          <span className="ae-doc-section-hint">Renewed every 2 years</span>
        </div>
        <div className="ae-checklist">
          {licenseDocs.map((doc) => <DocRow key={doc.id} doc={doc} documents={data.documents} onChange={handleFileChange} />)}
        </div>
      </div>

      <div className="ae-doc-section">
        <div className="ae-doc-section-header">
          <span className="ae-doc-section-title">📋 Contract &amp; Deployment</span>
        </div>
        <div className="ae-checklist">
          <DocRow doc={{ id: 'contract', label: 'Employee Contract' }} documents={data.documents} onChange={handleFileChange} />
          <div className="ae-check-item flex items-center justify-between">
            <span className="font-semibold text-sm">Contract End Date</span>
            <input
              type="date"
              className="ae-input"
              style={{ width: '200px', padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
              value={data.contractEndDate}
              onChange={(e) => onChange('contractEndDate', e.target.value)}
              min={data.hireDate || undefined}
            />
          </div>
          <DocRow doc={{ id: 'deployment_order', label: 'Deployment Order' }} disabled={isFloating} documents={data.documents} onChange={handleFileChange} />
          {isFloating && (
            <p className="ae-hint" style={{ marginTop: '-0.25rem', paddingLeft: '1rem' }}>
              Deployment order upload is available when an initial site assignment is selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
