import { useState, useEffect } from 'react';
import { FaBriefcase, FaUser } from 'react-icons/fa';
import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = authService.getToken();
        const { data } = await axios.get(`${API_BASE}/api/web/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile details', error);
        setProfile(authService.getProfile() || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="pf-details-card">Loading...</div>;
  }

  const userId = profile?.employee_id_number || 'ADMIN-001';
  const position = profile?.position || profile?.role || 'PRESIDENT';
  const dateJoinedStr = profile?.hire_date 
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profile.hire_date))
    : 'January 15, 2020';
  const firstName = profile?.first_name || 'John';
  const lastName = profile?.last_name || 'Juan';
  const email = profile?.contact_email || 'president@prismguard.com';
  const phone = profile?.phone_number || '+63 917 123 4567';

  return (
    <div className="pf-details-card">
      {/* Account Details */}
      <div className="pf-section">
        <h3 className="pf-section-title">
          <FaBriefcase className="pf-section-icon" /> Account Details
        </h3>
        <div className="pf-form-grid">
          <ReadonlyField label="User ID" value={userId} />
          <ReadonlyField label="Position" value={position.toUpperCase()} />
          <ReadonlyField label="Date Joined" value={dateJoinedStr} />
        </div>
      </div>

      <hr className="pf-section-divider" />

      {/* Personal Details */}
      <div className="pf-section">
        <h3 className="pf-section-title">
          <FaUser className="pf-section-icon" /> Personal Details
        </h3>
        <div className="pf-form-grid">
          <ReadonlyField label="First Name" value={firstName} />
          <ReadonlyField label="Last Name" value={lastName} />
          <ReadonlyField label="Email Address" value={email} />
          <ReadonlyField label="Phone Number" value={phone} />
        </div>
      </div>
    </div>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <div className="pf-field">
      <label className="pf-field-label">{label}</label>
      <div className="pf-field-value">{value}</div>
    </div>
  );
}
