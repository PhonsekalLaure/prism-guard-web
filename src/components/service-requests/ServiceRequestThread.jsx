function ThreadMessage({ message }) {
  const roleClass = message.sender_role === 'admin' ? 'admin' : 'client';

  return (
    <div className={`sr-thread-msg ${roleClass}`}>
      <div className="sr-thread-msg-header">
        <div className="sr-thread-msg-avatar">{message.sender_initials}</div>
        <div>
          <p className="sr-thread-msg-name">
            {message.sender_name} <span className="sr-thread-msg-role">{message.sender_label}</span>
          </p>
          <p className="sr-thread-msg-time">{message.date}</p>
        </div>
      </div>
      <p className="sr-thread-msg-text">{message.message}</p>
    </div>
  );
}

export default function ServiceRequestThread({
  messages = [],
  emptyText = 'No messages yet.',
  emptyClassName = 'sr-description-text',
}) {
  if (messages.length === 0) {
    return <p className={emptyClassName}>{emptyText}</p>;
  }

  return (
    <div className="sr-thread">
      {messages.map((message) => <ThreadMessage key={message.id} message={message} />)}
    </div>
  );
}
