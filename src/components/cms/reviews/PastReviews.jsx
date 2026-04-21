import { useState } from 'react';
import { FaHistory, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReviewCard from './ReviewCard';

const PAST_REVIEWS = [
  {
    id: 1,
    category: 'Guard Performance',
    status: 'Published',
    date: 'Feb 10, 2026',
    score: 5.0,
    text: "Outstanding performance from the security team during the university's enrollment period. Guards effectively managed crowd control and ensured smooth vehicle flow at all entry points. Special commendation for the night shift team at Main Gate.",
    site: 'Main Gate',
    period: 'Jan 2026',
    reviewer: 'Engr. Maria Santos',
  },
  {
    id: 2,
    category: 'Incident Response',
    status: 'Published',
    date: 'Jan 25, 2026',
    score: 4.0,
    text: 'Prompt and professional handling of the unauthorized vehicle access incident on Jan 20. The guard on duty responded within minutes and followed proper escalation procedures. However, the written report was delayed by one day which could be improved.',
    site: 'Parking Area',
    period: 'Jan 2026',
    reviewer: 'Engr. Maria Santos',
  },
  {
    id: 3,
    category: 'Communication',
    status: 'Published',
    date: 'Dec 20, 2025',
    score: 4.0,
    text: "Communication between the agency's operations team and our office has improved significantly this quarter. Shift change reports are now being submitted more consistently. The new online portal for service requests is a welcome addition.",
    site: 'All Sites',
    period: 'Dec 2025',
    reviewer: 'Engr. Maria Santos',
  },
  {
    id: 4,
    category: 'Overall Service',
    status: 'Pending',
    date: 'Nov 15, 2025',
    score: 4.5,
    text: 'Overall very satisfied with the security services provided this quarter. The guards are professional and well-trained. Response time to our requests has been consistently fast. Looking forward to continued partnership.',
    site: 'All Sites',
    period: 'Q3 2025',
    reviewer: 'Engr. Maria Santos',
  },
];

const CATEGORIES = [
  'All Categories',
  'Guard Performance',
  'Incident Response',
  'Communication',
  'Overall Service',
];

const SORT_OPTIONS = ['Most Recent', 'Highest Rated', 'Lowest Rated'];

export default function PastReviews() {
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort]         = useState('Most Recent');

  const filtered = PAST_REVIEWS
    .filter((r) => category === 'All Categories' || r.category === category)
    .sort((a, b) => {
      if (sort === 'Highest Rated') return b.score - a.score;
      if (sort === 'Lowest Rated')  return a.score - b.score;
      return 0; // Most Recent — data already in order
    });

  return (
    <div>
      {/* Section header */}
      <div className="srv-past-header">
        <h3 className="srv-past-title">
          <FaHistory /> Your Past Reviews
        </h3>
        <div className="srv-past-filters">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="srv-filter-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="srv-filter-select"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Review list */}
      <div className="srv-reviews-list">
        {filtered.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      <div className="srv-pagination">
        <p className="srv-pagination-info">
          Showing {filtered.length} of {PAST_REVIEWS.length} reviews
        </p>
        <div className="srv-page-btns">
          <button className="page-btn" disabled>
            <FaChevronLeft />
          </button>
          <button className="page-btn active">1</button>
          <button className="page-btn" disabled>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}