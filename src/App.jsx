import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import DashboardLayout from '@layouts/hris/DashboardLayout';
import DashboardPage from '@pages/hris/DashboardPage';
import ClientsPage from '@pages/hris/ClientsPage';
import BillingPage from '@pages/hris/BillingPage';
import EmployeesPage from '@pages/hris/EmployeesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard routes — nested under DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Route>

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
