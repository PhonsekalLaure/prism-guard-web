import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import DashboardLayout from '@layouts/hris/DashboardLayout';
import DashboardPage from '@pages/hris/DashboardPage';
import ClientsPage from '@pages/hris/ClientsPage';
import BillingPage from '@pages/hris/BillingPage';


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
          {/* Future pages will go here, e.g.: */}
          {/* <Route path="/employees" element={<EmployeesPage />} /> */}
        </Route>

        {/* CMS routes — client only (future) */}
        {/* <Route element={
          <ProtectedRoute allowedRoles={['client']}>
            <CmsLayout />
          </ProtectedRoute>
        }>
          <Route path="/cms/dashboard" element={<CmsDashboard />} />
        </Route> */}

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

