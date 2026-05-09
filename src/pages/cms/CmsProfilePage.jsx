import { useState, useEffect } from 'react';
import CmsProfileTopbar from '@cms-components/profile/CmsProfileTopbar';
import CompanyCard from '@cms-components/profile/CompanyCard';
import CompanyInformation from '@cms-components/profile/CompanyInformation';
import ContactPerson from '@cms-components/profile/ContactPerson';
import ContractSummary from '@cms-components/profile/ContractSummary';
import SiteLocations, { SiteLocationsSkeleton } from '@cms-components/profile/SiteLocations';
import ChangePasswordModal from '@components/profile/ChangePasswordModal';
import Notification from '@components/ui/Notification';
import profileService from '@services/profileService';
import authService from '@services/authService';
import useNotification from '@hooks/useNotification';
import '@styles/cms/CmsProfile.css';
import '@styles/components/Loading.css';

export default function CmsProfilePage() {
  const { notification, showNotification, closeNotification } = useNotification();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        if (!cancelled) {
          setProfile(data);
          authService.updateProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          showNotification(err?.response?.data?.error || 'Failed to load profile.', 'error');
          setProfile(authService.getProfile() || {});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [showNotification]);

  // Called by ContactPerson after a successful save to keep local state in sync
  function handleProfileUpdate(updates) {
    setProfile((prev) => ({ ...prev, ...updates }));
    authService.updateProfile(updates);
  }

  if (loading) {
    return (
      <>
        <CmsProfileTopbar />
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={closeNotification}
          />
        )}
        <div className="cms-content">
          <div className="cms-profile-layout">
            {/* Left Column Skeleton */}
            <div className="cms-profile-left-col detail-skeleton">
              <div className="cms-profile-company-card">
                <div className="cms-profile-company-card__header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="dsk-avatar" style={{ width: '80px', height: '80px', borderRadius: '18px', margin: '0 auto 1rem', background: 'rgba(255,255,255,0.2)' }} />
                  <div className="dsk-line lg" style={{ height: '18px', marginBottom: '0.6rem', background: 'rgba(255,255,255,0.3)' }} />
                  <div className="dsk-line sm" style={{ background: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="cms-profile-company-card__body">
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="dsk-icon-wrap" style={{ width: '34px', height: '34px' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div className="dsk-line sm" />
                        <div className="dsk-line md" />
                      </div>
                    </div>
                  ))}
                  <hr className="cms-profile-card__divider" />
                  <div className="cms-profile-card__actions">
                    <div className="dsk-btn" style={{ width: '100%', height: '42px' }} />
                    <div className="dsk-btn" style={{ width: '100%', height: '42px' }} />
                  </div>
                </div>
              </div>
              <SiteLocationsSkeleton />
            </div>

            {/* Right Column Skeleton */}
            <div className="cms-profile-right-col detail-skeleton">
              <div className="cms-profile-details-card">
                <div className="cms-profile-section">
                  <div className="dsk-line md" style={{ height: '20px', marginBottom: '1.25rem' }} />
                  <div className="cms-profile-field-grid">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={`info-${i}`} className="cms-profile-field">
                        <div className="dsk-line sm" style={{ marginBottom: '0.4rem' }} />
                        <div className="dsk-line lg" style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="cms-profile-section-divider" />
                <div className="cms-profile-section">
                  <div className="dsk-line md" style={{ height: '20px', marginBottom: '1.25rem' }} />
                  <div className="cms-profile-field-grid">
                    {[1, 2, 3].map((i) => (
                      <div key={`contact-${i}`} className="cms-profile-field">
                        <div className="dsk-line sm" style={{ marginBottom: '0.4rem' }} />
                        <div className="dsk-line lg" style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cms-profile-details-card">
                <div className="dsk-line md" style={{ height: '20px', marginBottom: '1.25rem' }} />
                <div className="cms-profile-field-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={`contract-${i}`} className="cms-profile-field">
                      <div className="dsk-line sm" style={{ marginBottom: '0.4rem' }} />
                      <div className="dsk-line lg" style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CmsProfileTopbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className="cms-content">
        <div className="cms-profile-layout">
          {/* Left Column */}
          <div className="cms-profile-left-col">
            <CompanyCard
              profile={profile}
              onEditProfile={() => setIsEditing(true)}
              onChangePassword={() => setIsChangePasswordOpen(true)}
            />
            <SiteLocations sites={profile?.sites} />
          </div>

          {/* Right Column */}
          <div className="cms-profile-right-col">
            <div className="cms-profile-details-card">
              <CompanyInformation profile={profile} />
              <hr className="cms-profile-section-divider" />
              <ContactPerson
                profile={profile}
                onProfileUpdate={handleProfileUpdate}
                isEditing={isEditing}
                onCancelEdit={() => setIsEditing(false)}
                onNotify={showNotification}
              />
            </div>
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
