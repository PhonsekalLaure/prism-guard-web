import { useState } from 'react';
import CmsProfileTopbar from '@cms-components/profile/CmsProfileTopbar';
import CompanyCard from '@cms-components/profile/CompanyCard';
import CompanyInformation from '@cms-components/profile/CompanyInformation';
import ContactPerson from '@cms-components/profile/ContactPerson';
import ContractSummary from '@cms-components/profile/ContractSummary';
import ChangePasswordModal from '@cms-components/profile/ChangePasswordModal';
import '@styles/cms/CmsProfile.css';

export default function CmsProfilePage() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <CmsProfileTopbar />

      <div className="cms-content">
        <div className="cms-profile-layout">
          {/* Left Column */}
          <div className="cms-profile-left-col">
            <CompanyCard onChangePassword={() => setIsChangePasswordOpen(true)} />
          </div>

          {/* Right Column */}
          <div className="cms-profile-right-col">
            <CompanyInformation />
            <ContactPerson />
            <ContractSummary />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}