import { Outlet } from 'react-router-dom';
import CmsSidebar from '../../components/cms/CmsSidebar';

export default function CmsLayout() {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      background: '#ecf0f1',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <CmsSidebar onLogoutClick={() => window.location.href = '/login'} />
      <main style={{
        flex: 1,
        minWidth: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <Outlet context={{ toggleSidebar: () => {} }} />
      </main>
    </div>
  );
}