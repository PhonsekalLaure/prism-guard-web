import { FaUser } from 'react-icons/fa';
import FormField from './ClientFormField';

export default function Step1ContactInfo({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaUser className="inline mr-2" /> Contact Information
      </h3>
      <div className="ae-form-grid">
        <FormField label="First Name *"   type="text"  required value={data.firstName}  onChange={(e) => onChange('firstName',  e.target.value)} />
        <FormField label="Last Name *"    type="text"  required value={data.lastName}   onChange={(e) => onChange('lastName',   e.target.value)} />
        <FormField label="Middle Name"    type="text"           value={data.middleName}  onChange={(e) => onChange('middleName', e.target.value)} />
        <FormField label="Suffix"         type="text"  placeholder="e.g. Jr., Sr., III" value={data.suffix} onChange={(e) => onChange('suffix', e.target.value)} />
        <FormField label="Email Address *" type="email" span2 required value={data.email}  onChange={(e) => onChange('email',  e.target.value)} />
        <FormField
          label="Mobile Number *"
          type="tel"
          span2
          required
          placeholder="912 345 6789"
          prefix="+63"
          value={data.mobile}
          onChange={(e) => onChange('mobile', e.target.value)}
        />
      </div>
    </div>
  );
}
