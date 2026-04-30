import { useState, useEffect } from 'react';
import { FaUserShield, FaEnvelope, FaPhone, FaKey, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import authService from '@services/authService';
import { getAdminRoleLabel } from '@utils/adminPermissions';

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
    return (
      <div className="pf-left-col detail-skeleton">
        <div className="pf-card">
          <div className="pf-card-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="dsk-avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1rem', border: '4px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.2)' }} />
            <div className="dsk-line lg" style={{ height: '18px', marginBottom: '0.6rem', background: 'rgba(255,255,255,0.3)' }} />
            <div className="dsk-line sm" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>
          <div className="pf-card-body">
            <div className="pf-contact-list">
              <div className="pf-contact-item">
                <div className="dsk-icon-wrap" style={{ width: '38px', height: '38px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="dsk-line sm" />
                  <div className="dsk-line md" />
                </div>
              </div>
              <div className="pf-contact-item">
                <div className="dsk-icon-wrap" style={{ width: '38px', height: '38px' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="dsk-line sm" />
                  <div className="dsk-line md" />
                </div>
              </div>
            </div>
            <hr className="pf-divider" />
            <div className="pf-actions">
              <div className="dsk-btn" style={{ width: '100%', height: '42px' }} />
              <div className="dsk-btn" style={{ width: '100%', height: '42px' }} />
            </div>
          </div>
        </div>
        <div className="pf-roles-card">
          <div className="dsk-line md" style={{ height: '16px', marginBottom: '1rem' }} />
          <div className="pf-roles-tags">
            <div className="dsk-chip" style={{ width: '90px', height: '28px', borderRadius: '20px' }} />
            <div className="dsk-chip" style={{ width: '110px', height: '28px', borderRadius: '20px' }} />
          </div>
        </div>
      </div>
    );
  }

  const fullName = profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'John Juan';
  const position = profile?.role === 'admin'
    ? getAdminRoleLabel(profile?.admin_role, profile?.role || 'Administrator')
    : (profile?.position || profile?.role || 'Client');
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
          <p className="pf-role">{String(position).toUpperCase()}</p>
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
          <span className="pf-role-tag blue">{profile?.role === 'admin' ? 'Administrator' : 'Client'}</span>
          {profile?.role === 'admin' && profile?.admin_role && (
            <span className="pf-role-tag purple">{getAdminRoleLabel(profile.admin_role)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
