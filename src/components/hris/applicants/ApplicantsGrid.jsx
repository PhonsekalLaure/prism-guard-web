import {
  FaBriefcase,
  FaEye,
  FaIdCard,
  FaPhone,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import EntityAvatar from '@components/ui/EntityAvatar';
import { EntityCardSkeleton, SkeletonList } from '@components/ui/Skeleton';

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
            <EntityAvatar
              avatarUrl={applicant.avatarUrl || applicant.avatar_url}
              initials={applicant.initials}
              className="applicant-avatar"
              alt={applicant.name || applicant.initials}
            />
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
  onResetFilters,
}) {
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;
  const limit = pagination?.limit || 6;
  const from = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const to = Math.min(page * limit, total);

  if (isLoading) {
    return (
      <div className="applicants-grid">
        <SkeletonList count={6}>{(index) => (
          <EntityCardSkeleton key={index} variant="applicant" />
        )}</SkeletonList>
      </div>
    );
  }

  if (!applicants.length) {
    return (
      <EmptyState
        title="No applicants found"
        description="We couldn't find any applicants matching your current search or filter criteria. Try adjusting your settings to view more applicants."
        actionLabel="Reset All Filters"
        onAction={onResetFilters}
      />
    );
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
