import { useState, useEffect } from 'react';
import axios from 'axios';
import authService from '@services/authService';
import ProfileTopbar from '@hris-components/profile/ProfileTopbar';
import ProfileCard from '@hris-components/profile/ProfileCard';
import ProfileDetails from '@hris-components/profile/ProfileDetails';
import ChangePasswordModal from '@hris-components/profile/ChangePasswordModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

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
        setProfile(authService.getProfile() || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <ProfileTopbar />

      <div className="dashboard-content">
        <div className="pf-layout">
          <ProfileCard 
            profile={profile} 
            loading={loading} 
            onEdit={() => setIsEditing(true)} 
            onChangePassword={() => setIsChangePasswordOpen(true)}
          />
          <ProfileDetails 
            profile={profile} 
            loading={loading} 
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
            onProfileUpdate={(updates) => setProfile(prev => ({...prev, ...updates}))}
          />
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onCancel={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
