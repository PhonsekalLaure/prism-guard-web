export default function HrisAttendanceAvatar({ row, className = '' }) {
  return (
    <div className={`ha-avatar ${className}`}>
      {row.avatarUrl && (
        <img
          src={row.avatarUrl}
          alt={`${row.name} avatar`}
          onError={(event) => {
            event.currentTarget.remove();
          }}
        />
      )}
      <span>{row.initials}</span>
    </div>
  );
}
