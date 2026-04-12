import ProfileTopbar from '@hris-components/profile/ProfileTopbar';
import ProfileCard from '@hris-components/profile/ProfileCard';
import ProfileDetails from '@hris-components/profile/ProfileDetails';

export default function ProfilePage() {
  return (
    <>
      <ProfileTopbar />

      <div className="dashboard-content">
        <div className="pf-layout">
          <ProfileCard />
          <ProfileDetails />
        </div>
      </div>
    </>
  );
}
