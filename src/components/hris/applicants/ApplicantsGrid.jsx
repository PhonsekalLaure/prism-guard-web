import {
  FaBriefcase, FaPhone, FaIdCard, FaEye, FaEllipsisV, FaCheckCircle, FaClock, FaExclamationCircle, FaStar,
} from 'react-icons/fa';

const applicants = [
  {
    id: 'APP-2026-0045',
    initials: 'MR',
    name: 'Miguel Reyes',
    applied: 'Applied 2 days ago',
    status: 'pending',
    position: 'Security Guard',
    phone: '+63 917 555 1234',
    license: 'PSG-2024-5678',
    physical: "Height: 5'8\" • Age: 28",
    tags: [
      { label: 'Valid License', color: 'tag-green', icon: FaCheckCircle },
      { label: 'NBI Clear',     color: 'tag-green', icon: FaCheckCircle },
    ],
  },
  {
    id: 'APP-2026-0044',
    initials: 'AS',
    name: 'Anna Santos',
    applied: 'Applied 1 week ago',
    status: 'pending',
    position: 'Security Guard',
    phone: '+63 928 555 9876',
    license: 'PSG-2024-4321',
    physical: "Height: 5'4\" • Age: 25",
    tags: [
      { label: 'Valid License', color: 'tag-green',  icon: FaCheckCircle },
      { label: 'NBI Pending',   color: 'tag-yellow', icon: FaClock },
    ],
  },
  {
    id: 'APP-2026-0043',
    initials: 'JT',
    name: 'Jose Torres',
    applied: 'Applied 3 days ago',
    status: 'pending',
    position: 'Security Officer',
    phone: '+63 912 555 3456',
    license: 'PSG-2024-7890',
    physical: "Height: 5'10\" • Age: 32",
    tags: [
      { label: 'Valid License', color: 'tag-green', icon: FaCheckCircle },
      { label: 'NBI Clear',     color: 'tag-green', icon: FaCheckCircle },
      { label: 'Experienced',   color: 'tag-blue',  icon: FaStar },
    ],
  },
  {
    id: 'APP-2026-0042',
    initials: 'LV',
    name: 'Lisa Villanueva',
    applied: 'Applied 5 days ago',
    status: 'pending',
    position: 'Security Guard',
    phone: '+63 919 555 7890',
    license: 'PSG-2024-2468',
    physical: "Height: 5'6\" • Age: 27",
    tags: [
      { label: 'Valid License',   color: 'tag-green', icon: FaCheckCircle },
      { label: 'Drug Test Clear', color: 'tag-green', icon: FaCheckCircle },
    ],
  },
  {
    id: 'APP-2026-0041',
    initials: 'RC',
    name: 'Rafael Cruz',
    applied: 'Applied 4 days ago',
    status: 'pending',
    position: 'Security Guard',
    phone: '+63 915 555 2468',
    license: 'PSG-2024-1357',
    physical: "Height: 5'9\" • Age: 30",
    tags: [
      { label: 'Valid License', color: 'tag-green', icon: FaCheckCircle },
      { label: "Height: 5'3\"", color: 'tag-red',   icon: FaExclamationCircle },
    ],
  },
  {
    id: 'APP-2026-0040',
    initials: 'DG',
    name: 'Diana Garcia',
    applied: 'Applied 1 week ago',
    status: 'pending',
    position: 'Lady Guard',
    phone: '+63 920 555 8642',
    license: 'PSG-2024-9753',
    physical: "Height: 5'5\" • Age: 26",
    tags: [
      { label: 'All Clear', color: 'tag-green', icon: FaCheckCircle },
    ],
  },
];

const STATUS_LABELS = {
  pending:   'PENDING',
  interview: 'INTERVIEW',
  hired:     'HIRED',
  rejected:  'REJECTED',
};

function ApplicantCard({ applicant, onReview }) {
  return (
    <div className="applicant-card" onClick={() => onReview(applicant)}>
      <div className="applicant-card-body">
        <div className="applicant-card-top">
          <div className="applicant-top-left">
            <div className="applicant-avatar">{applicant.initials}</div>
            <div>
              <p className="applicant-name">{applicant.name}</p>
              <p className="applicant-applied">{applicant.applied}</p>
            </div>
          </div>
          <span className={`applicant-status-badge status-${applicant.status}`}>
            {STATUS_LABELS[applicant.status]}
          </span>
        </div>

        <div className="applicant-info-list">
          <div className="applicant-info-row">
            <FaBriefcase className="info-icon" />
            <span>{applicant.position}</span>
          </div>
          <div className="applicant-info-row">
            <FaPhone className="info-icon" />
            <span>{applicant.phone}</span>
          </div>
          <div className="applicant-info-row">
            <FaIdCard className="info-icon" />
            <span>{applicant.physical}</span>
          </div>
        </div>

        <div className="applicant-qual-tags">
          {applicant.tags.map((t) => {
            const Icon = t.icon;
            return (
              <span key={t.label} className={`applicant-qual-tag ${t.color}`}>
                <Icon /> {t.label}
              </span>
            );
          })}
        </div>

        <div className="applicant-card-footer">
          <button className="applicant-review-link" onClick={(e) => { e.stopPropagation(); onReview(applicant); }}>
            <FaEye /> Review Application
          </button>
          <button className="applicant-more-btn" onClick={(e) => e.stopPropagation()}>
            <FaEllipsisV />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicantsGrid({ onReview }) {
  return (
    <>
      <div className="applicants-grid">
        {applicants.map((a) => (
          <ApplicantCard key={a.id} applicant={a} onReview={onReview} />
        ))}
      </div>

      <div className="applicants-pagination">
        <p className="applicants-pagination-info">Showing 1-6 of 47 applicants</p>
        <div className="applicants-page-btns">
          <button className="page-btn" disabled>‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">›</button>
        </div>
      </div>
    </>
  );
}
