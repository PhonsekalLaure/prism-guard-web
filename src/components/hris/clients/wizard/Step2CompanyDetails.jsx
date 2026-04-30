import { FaBuilding } from 'react-icons/fa';
import FormField from './ClientFormField';

export default function Step2CompanyDetails({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaBuilding className="inline mr-2" /> Company Details
      </h3>
      <div className="ae-form-grid">
        <FormField
          label="Company Name *"
          type="text"
          span2
          required
          value={data.company}
          onChange={(e) => onChange('company', e.target.value)}
        />
        <FormField
          label="Billing Address *"
          type="textarea"
          span2
          required
          placeholder="Enter billing address"
          value={data.billingAddress}
          onChange={(e) => onChange('billingAddress', e.target.value)}
        />
      </div>
    </div>
  );
}
