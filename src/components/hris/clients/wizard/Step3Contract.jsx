import { FaFileContract } from 'react-icons/fa';
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
          type="select"
          options={[
            { value: 'semi_monthly', label: 'Semi-Monthly' },
            { value: 'monthly',      label: 'Monthly'      },
            { value: 'weekly',       label: 'Weekly'       },
          ]}
          value={data.billingType}
          onChange={(e) => onChange('billingType', e.target.value)}
        />
      </div>
    </div>
  );
}
