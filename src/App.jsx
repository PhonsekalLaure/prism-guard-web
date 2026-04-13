import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CmsLayout from './layouts/cms/CmsLayout';
import CmsDashboardPage from './pages/cms/CmsDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CmsLayout />}>
          <Route path="/" element={<CmsDashboardPage />} />
          <Route path="/cms/dashboard" element={<CmsDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;