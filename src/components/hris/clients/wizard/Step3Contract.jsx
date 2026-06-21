import { FaFileContract, FaFileUpload } from 'react-icons/fa';
import FormField from './ClientFormField';
import {
  MAX_CLIENT_RATE_PER_GUARD,
  MIN_CLIENT_RATE_PER_GUARD,
} from '@constants/clientContractRules';

export default function Step3Contract({ data, onChange }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reasonable bounds to prevent accidental extreme dates (e.g., 1899 or 2099)
  const minStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const maxEndDateLimit = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const minEndDate = data.contractStartDate || tomorrow.toISOString().split('T')[0];

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
          min={minStartDate}
          max={data.contractEndDate || undefined}
          onChange={(e) => onChange('contractStartDate', e.target.value)}
        />
        <FormField
          label="Contract End Date *"
          type="date"
          required
          value={data.contractEndDate}
          min={minEndDate}
          max={maxEndDateLimit}
          onChange={(e) => onChange('contractEndDate', e.target.value)}
        />
        <FormField
          label="Rate per Guard *"
          type="number"
          placeholder="0.00"
          prefix="PHP"
          min={MIN_CLIENT_RATE_PER_GUARD}
          max={MAX_CLIENT_RATE_PER_GUARD}
          step="0.01"
          required
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
          label="Contract Document *"
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
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => onChange('contractUrl', e.target.files?.[0] || null)}
              />
            </label>
          }
        />
      </div>
    </div>
  );
}
