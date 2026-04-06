import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import DashboardLayout from '@layouts/admin/DashboardLayout';
import DashboardPage from '@pages/admin/DashboardPage';
import ClientsPage from '@pages/ClientsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard routes — nested under DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
        </Route>

        {/* Default route → login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
