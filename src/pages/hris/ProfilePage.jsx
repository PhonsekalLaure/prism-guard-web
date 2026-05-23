import { useState, useEffect } from 'react';
import authService from '@services/authService';
import profileService from '@services/profileService';
import { hasPermission } from '@utils/adminPermissions';
import ProfileTopbar from '@hris-components/profile/ProfileTopbar';
import ProfileCard from '@hris-components/profile/ProfileCard';
import ProfileDetails from '@hris-components/profile/ProfileDetails';
import ChangePasswordModal from '@components/profile/ChangePasswordModal';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const canWriteProfile = hasPermission(profile, 'profile.self.write');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        authService.updateProfile(data);
      } catch (error) {
        console.error('Error fetching profile', error);
        setProfile(authService.getProfile() || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    authService.updateProfile(updates);
  };

  return (
    <>
      <ProfileTopbar />

      <div className="dashboard-content">
        <div className="pf-layout">
          <ProfileCard 
            profile={profile} 
            loading={loading} 
            canEdit={canWriteProfile}
            onEdit={() => setIsEditing(true)}
            onChangePassword={() => setIsChangePasswordOpen(true)}
          />
          <ProfileDetails 
            profile={profile} 
            loading={loading} 
            isEditing={isEditing}
            canEdit={canWriteProfile}
            onCancel={() => setIsEditing(false)}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
