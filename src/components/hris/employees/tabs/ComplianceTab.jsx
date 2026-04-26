import { useRef } from 'react';
import {
  FaCertificate, FaFileAlt, FaFilePdf, FaFileImage,
  FaEye, FaDownload, FaUpload,
} from 'react-icons/fa';
import { InfoCell } from './EmployeeEditFields';

const docLabels = {
  valid_id:                   'Valid ID',
  resume:                     'Resume',
  personal_information_sheet: 'Personal Information Sheet',
  sg_license:                 'Security Guard License (LTOPF)',
  barangay:                   'Barangay Clearance',
  police:                     'Police Clearance',
  nbi:                        'NBI Clearance',
  neuro:                      'Neuro-Psychiatric Test',
  drugtest:                   'Drug Test Result',
  deployment_order:           'Deployment Order',
};

const ALL_TYPES = Object.keys(docLabels);

export default function ComplianceTab({ employee, isEditing, pendingFiles, onPreview, onClearanceFile }) {
  const fileInputRefs = useRef({});

  const handleViewDoc = (url) => {
    if (!url) return;
    const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf');
    if (isPdf) window.open(url, '_blank');
    else onPreview(url);
  };

  const getIsPdf = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf');
  };

  // Build existing clearance map
  const existingMap = {};
  (employee.clearances || []).forEach(c => { existingMap[c.clearance_type] = c; });
  if (!existingMap.personal_information_sheet && existingMap.biodata) {
    existingMap.personal_information_sheet = existingMap.biodata;
  }
  if (!existingMap.sg_license && existingMap.les) {
    existingMap.sg_license = existingMap.les;
  }
  if (employee.deployment_order_url) {
    existingMap.deployment_order = {
      clearance_type: 'deployment_order',
      document_url: employee.deployment_order_url,
    };
  }

  const displayTypes = isEditing
    ? ALL_TYPES.filter(type => type !== 'deployment_order' || employee.current_company !== 'Floating' || !!existingMap.deployment_order)
    : ALL_TYPES.filter(type => !!existingMap[type]);

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaCertificate className="ve-section-icon" /> Requirements &amp; Clearances
        </h3>

        {displayTypes.length > 0 ? (
          <div className="ve-doc-grid">
            {displayTypes.map((type) => {
              const c       = existingMap[type];
              const hasDoc  = !!(c?.document_url);
              const isPdf   = getIsPdf(c?.document_url);
              const pending = pendingFiles[type];

              return (
                <div key={type} className={`ve-doc-card ${hasDoc || pending ? 'has-doc' : 'no-doc'}`}>
                  <div className="ve-doc-card-icon-wrap">
                    <div className={`ve-doc-card-icon ${pending ? 'img' : isPdf ? 'pdf' : hasDoc ? 'img' : 'empty'}`}>
                      {pending ? <FaUpload /> : isPdf ? <FaFilePdf /> : hasDoc ? <FaFileImage /> : <FaFileAlt />}
                    </div>
                  </div>
                  <div className="ve-doc-card-info">
                    <p className="ve-doc-card-title">{docLabels[type] || type}</p>
                    <p className="ve-doc-card-sub">
                      {pending ? `New: ${pending.name}` : isPdf ? 'PDF Document' : hasDoc ? 'Image File' : 'Not yet uploaded'}
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => handleViewDoc(c?.document_url)}
                      disabled={!hasDoc}
                      className={`ve-doc-view-btn ${!hasDoc ? 'disabled' : isPdf ? 'pdf' : 'img'}`}
                      title={hasDoc ? (isPdf ? 'Open PDF' : 'Preview') : 'No document'}
                    >
                      {isPdf ? <FaDownload /> : <FaEye />}
                      <span>{isPdf ? 'Open' : 'Preview'}</span>
                    </button>
                  )}

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        ref={el => fileInputRefs.current[type] = el}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) onClearanceFile(type, file);
                        }}
                      />
                      <button
                        className={`ve-doc-view-btn img ${pending ? 'pdf' : ''}`}
                        onClick={() => fileInputRefs.current[type]?.click()}
                        title={hasDoc ? 'Replace document' : 'Upload document'}
                      >
                        <FaUpload />
                        <span>{pending ? 'Changed' : hasDoc ? 'Replace' : 'Upload'}</span>
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ve-doc-empty">
            <FaFileAlt className="ve-doc-empty-icon" />
            <p className="ve-doc-empty-text">No clearances or documents recorded.</p>
            <p className="ve-doc-empty-sub">Documents will appear here once uploaded during onboarding.</p>
          </div>
        )}
      </div>

      {/* Government IDs — always read-only */}
      <div className="ve-section">
        <h3 className="ve-section-title"><FaFileAlt className="ve-section-icon" /> Government Identity Numbers</h3>
        <div className="ve-info-grid cols-2 shadow-sm rounded-xl p-4 border border-gray-50 bg-white">
          <InfoCell label="TIN"              value={employee.tin_number        || 'N/A'} />
          <InfoCell label="SSS Number"       value={employee.sss_number        || 'N/A'} />
          <InfoCell label="PhilHealth Number" value={employee.philhealth_number || 'N/A'} />
          <InfoCell label="Pag-IBIG MID"     value={employee.pagibig_number    || 'N/A'} />
        </div>
      </div>
    </div>
  );
}
