import { FaBullhorn } from 'react-icons/fa';

export default function AnnouncementsInfoBanner() {
  return (
    <div className="ann-info-banner">
      <div className="ann-info-banner__icon">
        <FaBullhorn />
      </div>
      <div>
        <p className="ann-info-banner__title">Read-Only Announcements Board</p>
        <p className="ann-info-banner__body">
          Announcements are published by Prism Guard administrators. Click on any announcement to
          read the full message. New announcements will appear at the top of the list.
        </p>
      </div>
    </div>
  );
}
