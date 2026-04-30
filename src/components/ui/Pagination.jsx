import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/components/Pagination.css';

/**
 * Reusable Pagination Component with Ellipsis Logic
 * 
 * @param {number} currentPage - Currently active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 * @param {number} startIndex - Starting index of current view
 * @param {number} endIndex - Ending index of current view
 * @param {number} totalItems - Total count of items
 * @param {string} label - Item descriptive label (e.g. "employees")
 */
export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  startIndex, 
  endIndex, 
  totalItems,
  label = 'items'
}) {
  if (totalPages <= 0) return null;

  /**
   * Calculate which page numbers to display
   * Format: 1, 2, ..., current-1, current, current+1, ..., total-1, total
   */
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 7; // Maximum number of items in the pagination bar (including ellipses)

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first two
      pages.push(1);
      pages.push(2);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Show neighbors of current page
      const start = Math.max(3, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Always show last two
      if (!pages.includes(totalPages - 1)) pages.push(totalPages - 1);
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="ui-pagination">
      <p className="ui-pagination-info">
        Showing {startIndex + 1}-{endIndex} of {totalItems} {label}
      </p>
      
      <div className="ui-page-btns">
        <button 
          className="ui-page-btn" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <FaChevronLeft />
        </button>
        
        {getPageNumbers().map((page, i) => (
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="ui-pagination-ellipsis">...</span>
          ) : (
            <button
              key={page}
              className={`ui-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="ui-page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
