import { useEffect, useMemo } from 'react';
import { FaUser } from 'react-icons/fa';
import FormField from './ClientFormField';

export default function Step1ContactInfo({ data, onChange }) {
  const preview = useMemo(
    () => (data.avatar ? URL.createObjectURL(data.avatar) : null),
    [data.avatar]
  );

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaUser className="inline mr-2" /> Contact Information
      </h3>
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative transition-all group-hover:border-blue-400">
            {preview ? (
              <img src={preview} alt="Client Avatar Preview" className="w-full h-full object-cover" />
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
              onChange={(e) => onChange('avatar', e.target.files?.[0] || null)}
            />
          </div>
          {preview && (
            <button
              type="button"
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm hover:bg-red-600"
              onClick={() => onChange('avatar', null)}
            >
              x
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Client Profile Picture</p>
      </div>
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
