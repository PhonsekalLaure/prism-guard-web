import { FaShieldAlt } from 'react-icons/fa';
import '@styles/components/Loading.css';

export default function FullScreenLoader() {
  return (
    <div className="fs-loader-overlay">
      <div className="fs-loader-content">
        <div className="fs-loader-logo-wrapper">
          <FaShieldAlt className="fs-loader-icon" />
          <div className="fs-loader-pulse-ring"></div>
        </div>
        <h2 className="fs-loader-title">PRISM-Guard</h2>
        <p className="fs-loader-text">Authenticating securely...</p>
        <div className="fs-loader-bar-container">
          <div className="fs-loader-bar"></div>
        </div>
      </div>
    </div>
  );
}
