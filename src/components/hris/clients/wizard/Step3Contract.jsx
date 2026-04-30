import { FaFileContract, FaFileUpload } from 'react-icons/fa';
import FormField from './ClientFormField';

export default function Step3Contract({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaFileContract className="inline mr-2" /> Contract Details
      </h3>
      <div className="ae-form-grid">
        <FormField
          label="Contract Start Date *"
          type="date"
          required
          value={data.contractStartDate}
          onChange={(e) => onChange('contractStartDate', e.target.value)}
        />
        <FormField
          label="Contract End Date *"
          type="date"
          required
          value={data.contractEndDate}
          onChange={(e) => onChange('contractEndDate', e.target.value)}
        />
        <FormField
          label="Rate per Guard"
          type="number"
          placeholder="0.00"
          prefix="PHP"
          value={data.ratePerGuard}
          onChange={(e) => onChange('ratePerGuard', e.target.value)}
        />
        <FormField
          label="Billing Type"
          type="text"
          value="Semi-Monthly"
          readOnly
        />
        
        <FormField
          label="Contract Document"
          span2
          customInput={
            <label className={`dep-file-zone${data.contractUrl ? ' has-file' : ''}`}>
              <FaFileUpload className="dep-file-icon" />
              <div className="dep-file-info">
                {data.contractUrl ? (
                  <>
                    <p className="dep-file-name">{data.contractUrl.name}</p>
                    <p className="dep-file-hint">Click to replace file</p>
                  </>
                ) : (
                  <>
                    <p className="dep-file-name" style={{ color: '#64748b' }}>Upload contract document</p>
                    <p className="dep-file-hint">PDF or Image accepted</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) => onChange('contractUrl', e.target.files?.[0] || null)}
              />
            </label>
          }
        />
      </div>
    </div>
  );
}
