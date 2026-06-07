import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function CmsMobileSidebarToggle() {
  const { toggleSidebar } = useOutletContext();

  return (
    <button className="mobile-toggle" type="button" onClick={toggleSidebar} aria-label="Open navigation">
      <FaBars />
    </button>
  );
}
