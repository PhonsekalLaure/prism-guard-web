import { Outlet } from 'react-router-dom';
import CmsSidebar from '../../components/cms/CmsSidebar';
import '../../styles/cms/Dashboard.css';

export default function CmsLayout() {
  return (
    <div className="cms-layout">
      <CmsSidebar onLogoutClick={() => window.location.href = '/login'} />
      <main className="cms-main">
        <Outlet context={{ toggleSidebar: () => {} }} />
      </main>
    </div>
  );
}