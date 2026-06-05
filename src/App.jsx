import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import DashboardLayout from '@hris-layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from '@hris-pages/DashboardPage';
import ClientsPage from '@hris-pages/ClientsPage';
import BillingPage from '@hris-pages/BillingPage';
import HrisBillingDetailPage from '@hris-pages/HrisBillingDetailPage';
import EmployeesPage from '@hris-pages/EmployeesPage';
import EmployeeDetailPage from '@hris-pages/EmployeeDetailPage';
import AddEmployeePage from '@hris-pages/AddEmployeePage';
import ClientDetailPage from '@hris-pages/ClientDetailPage';
import AddClientPage    from '@hris-pages/AddClientPage';
import ProfilePage from '@hris-pages/ProfilePage';
import AdminManagementPage from '@hris-pages/AdminManagementPage';
import ApplicantsPage from '@hris-pages/ApplicantsPage';
import HrisServiceRequestsPage from '@hris-pages/HrisServiceRequestsPage';
import ServiceRequestDetailPage from '@hris-pages/ServiceRequestDetailPage';
import HrisServiceReviewsPage from '@hris-pages/HrisServiceReviewsPage';
import HrisLeaveRequestsPage from '@hris-pages/HrisLeaveRequestsPage';
import HrisLeaveRequestDetailPage from '@hris-pages/HrisLeaveRequestDetailPage';
import HrisAttendancePage from '@hris-pages/HrisAttendancePage';
import HrisCashAdvancePage from '@hris-pages/HrisCashAdvancePage';
import HrisCashAdvanceDetailPage from '@hris-pages/HrisCashAdvanceDetailPage';
import HrisPayrollPage from '@hris-pages/HrisPayrollPage';
import HrisIncidentsPage from '@hris-pages/HrisIncidentsPage';
import HrisIncidentDetailPage from '@hris-pages/HrisIncidentDetailPage';
import HrisAnnouncementsPage from '@hris-pages/HrisAnnouncementsPage';
import CmsLayout from '@cms-layouts/CmsLayout';
import CmsDashboardPage from '@cms-pages/CmsDashboardPage';
import DeployedGuardsPage from '@cms-pages/DeployedGuardsPage';
import ServiceRequestsPage from '@cms-pages/ServiceRequestsPage';
import IncidentReportsPage from '@cms-pages/IncidentReportsPage';
import CmsBillingPage from '@cms-pages/CmsBillingPage';
import ServiceReviewsPage from '@cms-pages/ServiceReviewsPage';
import SetPasswordPage from './pages/SetPasswordPage';
import CmsProfilePage from '@cms-pages/CmsProfilePage';
import CmsAnnouncementsPage from '@cms-pages/CmsAnnouncementsPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* HRIS routes — admin only */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ProtectedRoute requiredPermissions={['clients.read']}><ClientsPage /></ProtectedRoute>} />
          <Route path="/clients/new" element={<ProtectedRoute requiredPermissions={['clients.write']}><AddClientPage /></ProtectedRoute>} />
          <Route path="/clients/:id" element={<ProtectedRoute requiredPermissions={['clients.read']}><ClientDetailPage /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute requiredPermissions={['billing.read']}><BillingPage /></ProtectedRoute>} />
          <Route path="/billing/:id" element={<ProtectedRoute requiredPermissions={['billing.read']}><HrisBillingDetailPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute requiredPermissions={['employees.read']}><EmployeesPage /></ProtectedRoute>} />
          <Route path="/employees/new" element={<ProtectedRoute requiredPermissions={['employees.write']}><AddEmployeePage /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute requiredPermissions={['employees.read']}><EmployeeDetailPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute requiredPermissions={['profile.self.read']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin-management" element={<ProtectedRoute requiredPermissions={['admins.manage']}><AdminManagementPage /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute requiredPermissions={['applicants.read']}><ApplicantsPage /></ProtectedRoute>} />
          <Route path="/service-request" element={<ProtectedRoute requiredPermissions={['servicerequests.read']}><HrisServiceRequestsPage /></ProtectedRoute>} />
          <Route path="/service-requests/:id" element={<ProtectedRoute requiredPermissions={['servicerequests.read']}><ServiceRequestDetailPage /></ProtectedRoute>} />
          <Route path="/service-reviews" element={<ProtectedRoute requiredPermissions={['servicereviews.read']}><HrisServiceReviewsPage /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute requiredPermissions={['leaves.read']}><HrisLeaveRequestsPage /></ProtectedRoute>} />
          <Route path="/leaves/:id" element={<ProtectedRoute requiredPermissions={['leaves.read']}><HrisLeaveRequestDetailPage /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute requiredPermissions={['attendance.read']}><HrisAttendancePage /></ProtectedRoute>} />
          <Route path="/cash-advance" element={<ProtectedRoute requiredPermissions={['cashadvance.read']}><HrisCashAdvancePage /></ProtectedRoute>} />
          <Route path="/cash-advance/:id" element={<ProtectedRoute requiredPermissions={['cashadvance.read']}><HrisCashAdvanceDetailPage /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute requiredPermissions={['payroll.read']}><HrisPayrollPage /></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute requiredPermissions={['incidents.read']}><HrisIncidentsPage /></ProtectedRoute>} />
          <Route path="/incidents/:id" element={<ProtectedRoute requiredPermissions={['incidents.read']}><HrisIncidentDetailPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute requiredPermissions={['notifications.read']}><NotificationsPage portal="hris" /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute requiredPermissions={['announcements.read']}><HrisAnnouncementsPage /></ProtectedRoute>} />
        </Route>

        {/* CMS routes — client only */}
        <Route element={
          <ProtectedRoute allowedRoles={['client']}>
            <CmsLayout />
          </ProtectedRoute>
        }>
          <Route path="/cms/dashboard" element={<CmsDashboardPage />} />
          <Route path="/cms/deployed-guards" element={<DeployedGuardsPage />} />
          <Route path="/cms/service-requests" element={<ServiceRequestsPage />} />
          <Route path="/cms/incident-reports" element={<IncidentReportsPage />} />
          <Route path="/cms/billing" element={<CmsBillingPage />} />
          <Route path="/cms/reviews" element={<ServiceReviewsPage />} />
          <Route path="/cms/profile" element={<CmsProfilePage />} />
          <Route path="/cms/announcements" element={<CmsAnnouncementsPage />} />
          <Route path="/cms/notifications" element={<NotificationsPage portal="cms" />} />
        </Route>

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
