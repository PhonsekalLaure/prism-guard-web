import { useState } from 'react';

export default function EntityAvatar({
  avatarUrl,
  initials = 'NA',
  name = 'Profile',
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const canShowImage = Boolean(avatarUrl) && !failed;

  return (
    <div className={`entity-avatar ${className}${canShowImage ? ' has-image' : ''}`}>
      {canShowImage ? (
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
