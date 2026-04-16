import { useState, useEffect } from 'react';
import { FaUserShield, FaEnvelope, FaPhone, FaKey, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProfileCard() {
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
        console.error('Error fetching profile', error);
        // Fallback to local
        setProfile(authService.getProfile() || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="pf-left-col"><div className="pf-card">Loading...</div></div>;
  }

  const fullName = profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'John Juan';
  const position = profile?.position || profile?.role || 'PRESIDENT';
  const email = profile?.contact_email || 'president@prismguard.com';
  const phone = profile?.phone_number || '+63 917 123 4567';

  return (
    <div className="pf-left-col">
      {/* Main Profile Card */}
      <div className="pf-card">
        {/* Blue header */}
        <div className="pf-card-header">
          <div className="pf-avatar">
            <FaUserShield />
          </div>
          <h3 className="pf-name">{fullName}</h3>
          <p className="pf-role">{position.toUpperCase()}</p>
        </div>

        {/* Contact info */}
        <div className="pf-card-body">
          <div className="pf-contact-list">
            <div className="pf-contact-item">
              <div className="pf-contact-icon">
                <FaEnvelope />
              </div>
              <div>
                <p className="pf-contact-label">Email Address</p>
                <p className="pf-contact-value">{email}</p>
              </div>
            </div>

            <div className="pf-contact-item">
              <div className="pf-contact-icon">
                <FaPhone />
              </div>
              <div>
                <p className="pf-contact-label">Phone Number</p>
                <p className="pf-contact-value">{phone}</p>
              </div>
            </div>
          </div>

          <hr className="pf-divider" />

          {/* Actions */}
          <div className="pf-actions">
            <button className="pf-btn pf-btn-outline">
              <FaEdit /> Edit Profile
            </button>
            <button className="pf-btn pf-btn-gold">
              <FaKey /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* System Roles Card */}
      <div className="pf-roles-card">
        <h4 className="pf-roles-title">
          <FaUserShield /> System Roles
        </h4>
        <div className="pf-roles-tags">
          <span className="pf-role-tag blue">Administrator</span>
          <span className="pf-role-tag purple">Approver</span>
          <span className="pf-role-tag green">Payroll Manager</span>
        </div>
      </div>
    </div>
  );
}
