import { useState } from 'react';
import ApplicantsTopbar from '@hris-components/applicants/ApplicantsTopbar';
import ApplicantsStatCards from '@hris-components/applicants/ApplicantsStatCards';
import ApplicantsFilterBar from '@hris-components/applicants/ApplicantsFilterBar';
import ApplicantsGrid from '@hris-components/applicants/ApplicantsGrid';
import ReviewApplicantModal from '@hris-components/applicants/ReviewApplicantModal';
import '../../styles/hris/Applicants.css';

export default function ApplicantsPage() {
  const [reviewApplicant, setReviewApplicant] = useState(null);

  return (
    <>
      <ApplicantsTopbar />

      <div className="dashboard-content">
        <ApplicantsStatCards />
        <ApplicantsFilterBar />
        <ApplicantsGrid onReview={(a) => setReviewApplicant(a)} />
      </div>

      <ReviewApplicantModal
        isOpen={!!reviewApplicant}
        applicant={reviewApplicant}
        onClose={() => setReviewApplicant(null)}
      />
    </>
  );
}
