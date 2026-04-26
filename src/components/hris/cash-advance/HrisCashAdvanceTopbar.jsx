import { FaDownload } from 'react-icons/fa';

export default function HrisCashAdvanceTopbar() {
  return (
    <header className="ca-topbar">
      <div className="ca-title-group">
        <h2>Cash Advance Requests (Bale)</h2>
        <p>Review and approve employee cash advance requests applications</p>
      </div>
      <button className="ca-export-btn">
        <FaDownload /> Export Report
      </button>
    </header>
  );
}
