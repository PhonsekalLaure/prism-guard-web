import { useState } from 'react';

export default function LeaveRequestAvatar({
  avatarUrl,
  initials = 'NA',
  className = 'hlr-avatar',
}) {
  const [failed, setFailed] = useState(false);
  const canShowImage = Boolean(avatarUrl) && !failed;

  return (
    <div className={`${className}${canShowImage ? ' has-image' : ''}`}>
      {canShowImage ? (
        <img
          src={avatarUrl}
          alt=""
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}
