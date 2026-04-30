import { useEffect, useState } from 'react';
import AdminMgmtTopbar from '@hris-components/admin-management/AdminMgmtTopbar';
import AdminMgmtAlertBox from '@hris-components/admin-management/AdminMgmtAlertBox';
import AdminMgmtGrid from '@hris-components/admin-management/AdminMgmtGrid';
import CreateAdminModal from '@hris-components/admin-management/CreateAdminModal';
import ViewAdminModal from '@hris-components/admin-management/ViewAdminModal';
import DeleteAdminDialog from '@hris-components/admin-management/DeleteAdminDialog';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import adminService from '@services/adminService';
import '../../styles/hris/AdminManagement.css';

export default function AdminManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    let cancelled = false;

    async function loadAdmins() {
      try {
        setLoading(true);
        setError('');
        const data = await adminService.getAllAdmins();
        if (!cancelled) {
          setAdmins(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || err.message || 'Failed to load admin accounts.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAdmins();
    return () => { cancelled = true; };
  }, []);

  async function refreshAdmins() {
    const refreshedAdmins = await adminService.getAllAdmins();
    setAdmins(refreshedAdmins);
    return refreshedAdmins;
  }

  async function handleCreateAdmin(formData) {
    try {
      setCreating(true);
      const result = await adminService.createAdmin(formData);
      await refreshAdmins();
      setIsCreateOpen(false);
      showNotification(result.message || 'Admin account created successfully.', 'success');
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to create admin account.');
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateAdmin(id, formData) {
    if (!id) return;

    try {
      setUpdating(true);
      const result = await adminService.updateAdmin(id, formData);
      const refreshedAdmins = await refreshAdmins();
      const nextSelectedAdmin = refreshedAdmins.find((admin) => admin.id === id) || null;
      setSelectedAdmin(nextSelectedAdmin);
      showNotification(result.message || 'Admin account updated successfully.', 'success');
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to update admin account.');
    } finally {
      setUpdating(false);
    }
  }

  function promptDeleteAdmin(admin) {
    if (!admin) return;
    setAdminToDelete(admin);
  }

  async function confirmDeleteAdmin() {
    if (!adminToDelete) return;

    try {
      setDeletingId(adminToDelete.id);
      const result = await adminService.deleteAdmin(adminToDelete.id);
      await refreshAdmins();
      setSelectedAdmin(null);
      showNotification(result.message || 'Admin account deleted successfully.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to delete admin account.', 'error');
    } finally {
      setDeletingId('');
      setAdminToDelete(null);
    }
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <AdminMgmtTopbar onCreateAdmin={() => setIsCreateOpen(true)} />

      <div className="dashboard-content">
        <AdminMgmtAlertBox />
        <AdminMgmtGrid
          admins={admins}
          loading={loading}
          error={error}
          onAdminClick={(admin) => setSelectedAdmin(admin)}
        />
      </div>

      {isCreateOpen && (
        <CreateAdminModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateAdmin}
          isSubmitting={creating}
        />
      )}

      {selectedAdmin && (
        <ViewAdminModal
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onUpdateAdmin={handleUpdateAdmin}
          isUpdating={updating}
          onDelete={promptDeleteAdmin}
          isDeleting={deletingId === selectedAdmin.id}
        />
      )}

      {adminToDelete && (
        <DeleteAdminDialog
          isOpen={!!adminToDelete}
          adminName={adminToDelete.full_name}
          isDeleting={deletingId === adminToDelete.id}
          onCancel={() => setAdminToDelete(null)}
          onConfirm={confirmDeleteAdmin}
        />
      )}
    </>
  );
}
