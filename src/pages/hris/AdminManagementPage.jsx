import { useState } from 'react';
import AdminMgmtTopbar from '@hris-components/admin-management/AdminMgmtTopbar';
import AdminMgmtAlertBox from '@hris-components/admin-management/AdminMgmtAlertBox';
import AdminMgmtGrid from '@hris-components/admin-management/AdminMgmtGrid';
import CreateAdminModal from '@hris-components/admin-management/CreateAdminModal';
import '../../styles/hris/AdminManagement.css';

export default function AdminManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <AdminMgmtTopbar onCreateAdmin={() => setIsCreateOpen(true)} />

      <div className="dashboard-content">
        <AdminMgmtAlertBox />
        <AdminMgmtGrid />
      </div>

      <CreateAdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
