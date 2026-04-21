import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import DashboardLayout from '@hris-layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from '@hris-pages/DashboardPage';
import ClientsPage from '@hris-pages/ClientsPage';
import BillingPage from '@hris-pages/BillingPage';
import EmployeesPage from '@hris-pages/EmployeesPage';
import ProfilePage from '@hris-pages/ProfilePage';
import CmsLayout from '@cms-layouts/CmsLayout';
import CmsDashboardPage from '@cms-pages/CmsDashboardPage';
import DeployedGuardsPage from '@cms-pages/DeployedGuardsPage';
import ServiceRequestsPage from '@cms-pages/ServiceRequestsPage';
import IncidentReportsPage from '@cms-pages/IncidentReportsPage';
import CmsBillingPage from '@cms-pages/CmsBillingPage';
import ServiceReviewsPage from '@cms-pages/ServiceReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* HRIS routes — admin only */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
        </Route>

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;