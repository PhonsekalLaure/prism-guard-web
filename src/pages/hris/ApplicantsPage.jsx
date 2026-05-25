import { useCallback, useEffect, useMemo, useState } from 'react';
import ApplicantsTopbar from '@hris-components/applicants/ApplicantsTopbar';
import ApplicantsStatCards from '@hris-components/applicants/ApplicantsStatCards';
import ApplicantsFilterBar from '@hris-components/applicants/ApplicantsFilterBar';
import ApplicantsGrid from '@hris-components/applicants/ApplicantsGrid';
import { mapApplicantForDisplay } from '@utils/applicantMapper';
import ReviewApplicantModal from '@hris-components/applicants/ReviewApplicantModal';
import applicantService from '@services/hris/applicantService';
import '../../styles/hris/Applicants.css';

export default function ApplicantsPage() {
  const [reviewApplicant, setReviewApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', position: 'all', status: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayApplicants = useMemo(
    () => applicants.map(mapApplicantForDisplay),
    [applicants]
  );

  const selectedApplicant = useMemo(() => {
    if (!reviewApplicant) return null;
    return displayApplicants.find((applicant) => applicant.id === reviewApplicant.id) || reviewApplicant;
  }, [displayApplicants, reviewApplicant]);

  const loadApplicants = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listResult, statsResult] = await Promise.all([
        applicantService.getApplicants(page, 6, filters),
        applicantService.getApplicantStats(),
      ]);
      setApplicants(listResult.data || []);
      setPagination(listResult.metadata || { total: 0, page, limit: 6, totalPages: 1 });
      setStats(statsResult || {});
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const updateFilters = (updates) => {
    setFilters((current) => ({ ...current, ...updates }));
    setPage(1);
  };

  const handleScheduleInterview = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await applicantService.scheduleInterview(id, payload);
      await loadApplicants();
      setReviewApplicant(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await applicantService.rejectApplicant(id, payload);
      await loadApplicants();
      setReviewApplicant(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await applicantService.acceptApplicant(id, payload);
      await loadApplicants();
      setReviewApplicant(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ApplicantsTopbar />

      <div className="dashboard-content">
        <ApplicantsStatCards stats={stats} loading={isLoading} />
        <ApplicantsFilterBar filters={filters} onChange={updateFilters} />
        <ApplicantsGrid
          applicants={displayApplicants}
          pagination={pagination}
          page={page}
          onPageChange={setPage}
          onReview={(a) => setReviewApplicant(a)}
          isLoading={isLoading}
        />
      </div>

      <ReviewApplicantModal
        key={selectedApplicant?.id || 'none'}
        isOpen={!!selectedApplicant}
        applicant={selectedApplicant}
        onClose={() => setReviewApplicant(null)}
        onScheduleInterview={handleScheduleInterview}
        onReject={handleReject}
        onAccept={handleAccept}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
