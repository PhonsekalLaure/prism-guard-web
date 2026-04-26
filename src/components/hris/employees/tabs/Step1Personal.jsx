import { useState, useEffect } from 'react';
import FormField from './FormField';
import GoogleAddressAutofill from '../GoogleAddressAutofill';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Step1Personal({ data, onChange }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (data.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(data.avatar);
    } else {
      setPreview(null);
    }
  }, [data.avatar]);

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Personal Information</h3>

      {/* Avatar upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative transition-all group-hover:border-blue-400">
            {preview ? (
              <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center">
                <span className="text-xl block">+</span>
                <span className="text-[10px] uppercase font-bold">Photo</span>
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => onChange('avatar', e.target.files[0])}
            />
          </div>
          {preview && (
            <button
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm hover:bg-red-600"
              onClick={() => onChange('avatar', null)}
            >
              ×
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Employee Profile Picture</p>
      </div>

      <div className="ae-form-grid">
        <FormField label="First Name *"    type="text"   required value={data.firstName}    onChange={(e) => onChange('firstName',    e.target.value)} />
        <FormField label="Last Name *"     type="text"   required value={data.lastName}     onChange={(e) => onChange('lastName',     e.target.value)} />
        <FormField label="Middle Name"     type="text"            value={data.middleName}    onChange={(e) => onChange('middleName',   e.target.value)} />
        <FormField label="Suffix"          type="text"            value={data.suffix}        onChange={(e) => onChange('suffix',       e.target.value)} />
        <FormField label="Date of Birth *" type="date"   required value={data.dob}          onChange={(e) => onChange('dob',          e.target.value)} />
        <FormField label="Gender *"        type="select" required value={data.gender}       onChange={(e) => onChange('gender',       e.target.value)}
          options={['Select gender', 'Male', 'Female']} />
        <FormField label="Height *"        type="text"   required value={data.height}       onChange={(e) => onChange('height',       e.target.value)} placeholder="e.g., 170 cm" />
        <FormField label="Marital Status *" type="select" required value={data.civilStatus} onChange={(e) => onChange('civilStatus',  e.target.value)}
          options={['Select status', 'Single', 'Married', 'Widowed']} />
        <FormField label="Citizenship *"   type="text"            value="Filipino" readOnly />
        <FormField label="Educational Attainment *" type="select" required value={data.educationalLevel} onChange={(e) => onChange('educationalLevel', e.target.value)}
          options={['Select level', 'Elementary Graduate', 'High School Graduate', 'Vocational / TESDA', 'College Level', "Bachelor's Degree", "Master's Degree", 'Doctorate']} />
        <FormField label="Blood Type"      type="select"          value={data.bloodType}    onChange={(e) => onChange('bloodType',    e.target.value)}
          options={['Select blood type', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
        <FormField label="Place of Birth"  type="text"            value={data.placeOfBirth} onChange={(e) => onChange('placeOfBirth', e.target.value)} placeholder="e.g., Manila City" />
        <FormField label="Mobile Number *" type="tel"    required span2 prefix="+63" value={data.mobile} onChange={(e) => onChange('mobile', e.target.value)} placeholder="912 345 6789" />
        <FormField label="Email Address *" type="email"  required span2 value={data.email}  onChange={(e) => onChange('email',        e.target.value)} />

        <div className="ae-form-group span-2">
          <label>Residential Address *</label>
          <GoogleAddressAutofill
            apiKey={GOOGLE_MAPS_KEY}
            value={data.address}
            onChange={(e) => { onChange('address', e.target.value); onChange('latitude', null); onChange('longitude', null); }}
            className="ae-input"
            placeholder="Search for an address..."
            onPlaceSelected={({ formattedAddress, lat, lng }) => {
              onChange('address', formattedAddress);
              onChange('latitude', lat);
              onChange('longitude', lng);
            }}
          />
          <p className="ae-hint">Select a validated address to automatically save geographical coordinates for deployment distance calculations.</p>
        </div>

        <FormField label="Provincial Address" type="textarea" span2 value={data.provincialAddress} onChange={(e) => onChange('provincialAddress', e.target.value)} placeholder="Complete provincial address" />
        <FormField label="Emergency Contact Name *"   type="text" required value={data.emergencyName}         onChange={(e) => onChange('emergencyName',         e.target.value)} />
        <FormField label="Emergency Contact Number *" type="tel"  required prefix="+63" value={data.emergencyContact}     onChange={(e) => onChange('emergencyContact',     e.target.value)} placeholder="912 345 6789" />
        <FormField label="Relationship"               type="text"          value={data.emergencyRelationship} onChange={(e) => onChange('emergencyRelationship', e.target.value)} placeholder="e.g., Spouse, Parent" />
      </div>
    </div>
  );
}
