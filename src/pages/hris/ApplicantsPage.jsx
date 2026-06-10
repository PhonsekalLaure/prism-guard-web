import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantsTopbar from '@hris-components/applicants/ApplicantsTopbar';
import ApplicantsStatCards from '@hris-components/applicants/ApplicantsStatCards';
import ApplicantsFilterBar from '@hris-components/applicants/ApplicantsFilterBar';
import ApplicantsGrid from '@hris-components/applicants/ApplicantsGrid';
import { mapApplicantForDisplay } from '@utils/applicantMapper';
import ReviewApplicantModal from '@hris-components/applicants/ReviewApplicantModal';
import applicantService from '@services/hris/applicantService';
import '../../styles/hris/Applicants.css';

function buildHireNavigationApplicant(applicant) {
  if (!applicant) return null;

  const sourceApplicant = { ...applicant };
  [
    'tags',
    'initials',
    'name',
    'applied',
    'appliedDate',
    'interviewDate',
    'physical',
    'age',
    'height',
    'license',
    'phone',
    'position',
  ].forEach((key) => {
    delete sourceApplicant[key];
  });

  return {
    ...sourceApplicant,
    profile_photo_url: applicant.profile_photo_url || applicant.avatarUrl || null,
  };
}

export default function ApplicantsPage() {
  const navigate = useNavigate();
  const [reviewApplicant, setReviewApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', position: 'all', status: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setError('');
      const [listResult, statsResult] = await Promise.all([
        applicantService.getApplicants(page, 6, filters),
        applicantService.getApplicantStats(),
      ]);
      setApplicants(listResult.data || []);
      setPagination(listResult.metadata || { total: 0, page, limit: 6, totalPages: 1 });
      setStats(statsResult || {});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applicants.');
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

  const handleResetFilters = () => {
    setFilters({ search: '', position: 'all', status: 'all' });
    setPage(1);
  };

  const handleScheduleInterview = async (id, payload) => {
    setIsSubmitting(true);
    try {
      setError('');
      await applicantService.scheduleInterview(id, payload);
      await loadApplicants();
      setReviewApplicant(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule interview.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id, payload) => {
    setIsSubmitting(true);
    try {
      setError('');
      await applicantService.rejectApplicant(id, payload);
      await loadApplicants();
      setReviewApplicant(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject applicant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHire = (applicant) => {
    navigate('/employees/new', {
      state: {
        sourceApplicant: buildHireNavigationApplicant(applicant),
      },
    });
  };

  return (
    <>
      <ApplicantsTopbar />

      <div className="dashboard-content">
        {error && <div className="applicants-error-banner">{error}</div>}
        <ApplicantsStatCards stats={stats} loading={isLoading} />
        <ApplicantsFilterBar filters={filters} onChange={updateFilters} />
        <ApplicantsGrid
          applicants={displayApplicants}
          pagination={pagination}
          page={page}
          onPageChange={setPage}
          onReview={(a) => setReviewApplicant(a)}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
        />
      </div>

      <ReviewApplicantModal
        key={selectedApplicant?.id || 'none'}
        isOpen={!!selectedApplicant}
        applicant={selectedApplicant}
        onClose={() => setReviewApplicant(null)}
        onScheduleInterview={handleScheduleInterview}
        onReject={handleReject}
        onHire={handleHire}
        isSubmitting={isSubmitting}
        actionError={error}
      />
    </>
  );
}
