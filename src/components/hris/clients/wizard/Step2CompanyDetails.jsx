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
          placeholder="e.g. Acme Security Client Corp."
          value={data.company}
          onChange={(e) => onChange('company', e.target.value)}
        />
        <FormField
          label="Billing Address *"
          type="textarea"
          span2
          required
          placeholder="e.g. 123 Ayala Avenue, Makati City"
          value={data.billingAddress}
          onChange={(e) => onChange('billingAddress', e.target.value)}
        />
        <FormField
          label="Client TIN *"
          type="text"
          required
          placeholder="e.g. 000-000-000-000"
          value={data.tinNumber}
          onChange={(e) => onChange('tinNumber', e.target.value)}
        />
        <FormField
          label="Registered Business Name"
          type="text"
          placeholder="Leave blank if same as company"
          value={data.registeredBusinessName}
          onChange={(e) => onChange('registeredBusinessName', e.target.value)}
        />
        <FormField
          label="Business Style"
          type="text"
          span2
          placeholder="Optional trade name / business style"
          value={data.businessStyle}
          onChange={(e) => onChange('businessStyle', e.target.value)}
        />
        <FormField
          label="Authorized Representative"
          type="text"
          placeholder="e.g. Maria Santos"
          value={data.authorizedRepresentativeName}
          onChange={(e) => onChange('authorizedRepresentativeName', e.target.value)}
        />
        <FormField
          label="Representative Title"
          type="text"
          placeholder="e.g. Operations Manager"
          value={data.authorizedRepresentativeTitle}
          onChange={(e) => onChange('authorizedRepresentativeTitle', e.target.value)}
        />
      </div>
    </div>
  );
}