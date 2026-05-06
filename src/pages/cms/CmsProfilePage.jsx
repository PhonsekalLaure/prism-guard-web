import { useState, useEffect } from 'react';
import CmsProfileTopbar from '@cms-components/profile/CmsProfileTopbar';
import CompanyCard from '@cms-components/profile/CompanyCard';
import CompanyInformation from '@cms-components/profile/CompanyInformation';
import ContactPerson from '@cms-components/profile/ContactPerson';
import ContractSummary from '@cms-components/profile/ContractSummary';
import ChangePasswordModal from '@components/profile/ChangePasswordModal';
import profileService from '@services/profileService';
import authService from '@services/authService';
import '@styles/cms/CmsProfile.css';

export default function CmsProfilePage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getProfile();
        if (!cancelled) {
          setProfile(data);
          authService.updateProfile(data);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.error || 'Failed to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  // Called by ContactPerson after a successful save to keep local state in sync
  function handleProfileUpdate(updates) {
    setProfile((prev) => ({ ...prev, ...updates }));
    authService.updateProfile(updates);
  }

  if (loading) {
    return (
      <>
        <CmsProfileTopbar />
        <div className="cms-content">
          <div className="cms-profile-loading">Loading profile…</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CmsProfileTopbar />
        <div className="cms-content">
          <div className="cms-profile-error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <CmsProfileTopbar />

      <div className="cms-content">
        <div className="cms-profile-layout">
          {/* Left Column */}
          <div className="cms-profile-left-col">
            <CompanyCard
              profile={profile}
              onEditProfile={() => setIsEditing(true)}
              onChangePassword={() => setIsChangePasswordOpen(true)}
            />
          </div>

          {/* Right Column */}
          <div className="cms-profile-right-col">
            <CompanyInformation profile={profile} />
            <ContactPerson
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
              isEditing={isEditing}
              onCancelEdit={() => setIsEditing(false)}
            />
            <ContractSummary profile={profile} />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        variant="cms"
      />
    </>
  );
}
