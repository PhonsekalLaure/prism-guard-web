import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import DashboardLayout from '@layouts/hris/DashboardLayout';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/hris/DashboardPage';
import ClientsPage from '@pages/hris/ClientsPage';
import BillingPage from '@pages/hris/BillingPage';
import EmployeesPage from '@pages/hris/EmployeesPage';
import ProfilePage from '@pages/hris/ProfilePage';
import CmsLayout from './layouts/cms/CmsLayout';
import CmsDashboardPage from './pages/cms/CmsDashboardPage';

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

        {/* CMS routes — client only (future) */}
        <Route element={
          <ProtectedRoute allowedRoles={['client']}>
            <CmsLayout />
          </ProtectedRoute>
        }>
          <Route path="/cms/dashboard" element={<CmsDashboardPage />} />

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

