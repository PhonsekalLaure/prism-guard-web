import { useState } from 'react';

export default function EntityAvatar({
  avatarUrl,
  initials = 'NA',
  alt = '',
  fallbackContent,
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const canShowImage = Boolean(avatarUrl) && !failed;

  return (
    <div className={`${className || 'entity-avatar'}${canShowImage ? ' has-image' : ''}`}>
      {canShowImage ? (
        <img
          src={avatarUrl}
          alt={alt}
          onError={() => setFailed(true)}
        />
      ) : (
        fallbackContent || initials
      )}
    </div>
  );
}
