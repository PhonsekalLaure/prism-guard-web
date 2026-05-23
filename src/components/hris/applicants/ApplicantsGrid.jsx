import {
  FaBriefcase,
  FaEye,
  FaIdCard,
  FaPhone,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';

const STATUS_LABELS = {
  pending: 'PENDING',
  interview: 'INTERVIEW',
  hired: 'HIRED',
  rejected: 'REJECTED',
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
            {STATUS_LABELS[applicant.status] || applicant.status}
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
          {applicant.tags.map((tag) => {
            const Icon = tag.icon;
            return (
              <span key={tag.label} className={`applicant-qual-tag ${tag.color}`}>
                <Icon /> {tag.label}
              </span>
            );
          })}
        </div>

        <div className="applicant-card-footer">
          <button className="applicant-review-link" onClick={(event) => { event.stopPropagation(); onReview(applicant); }}>
            <FaEye /> Review Application
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicantsGrid({
  applicants = [],
  pagination,
  page,
  onPageChange,
  onReview,
  isLoading,
}) {
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;
  const limit = pagination?.limit || 6;
  const from = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const to = Math.min(page * limit, total);

  if (isLoading) {
    return <p className="applicants-empty">Loading applicants...</p>;
  }

  if (!applicants.length) {
    return <p className="applicants-empty">No applicants found.</p>;
  }

  return (
    <>
      <div className="applicants-grid">
        {applicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} onReview={onReview} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={from - 1}
        endIndex={to}
        totalItems={total}
        label="applicants"
      />
    </>
  );
}
