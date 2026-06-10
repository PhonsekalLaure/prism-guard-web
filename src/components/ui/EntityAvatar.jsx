import { useState } from 'react';

export default function EntityAvatar({
  avatarUrl,
  initials = 'NA',
  alt = '',
  fallbackContent,
  className = '',
  style = {},
}) {
  const [failed, setFailed] = useState(false);
  const canShowImage = Boolean(avatarUrl) && !failed;

  return (
    <div className={`entity-avatar ${className}${canShowImage ? ' has-image' : ''}`} style={style}>
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
