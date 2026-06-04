import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

/**
 * StarRating — interactive star input component.
 *
 * Props:
 *   id          — unique identifier for the group
 *   size        — 'lg' | 'sm'  (controls star size class)
 *   value       — controlled rating value (1–5 or 0)
 *   onChange    — (rating: number) => void
 *   showLabel   — show the text label below stars (overall rating only)
 */
export default function StarRating({ id, size = 'sm', value = 0, onChange, showLabel = false }) {
  const [hovered, setHovered] = useState(0);

  const displayed = hovered || value;

  return (
    <div>
      <div
        className={`srv-stars srv-stars--${size}`}
        onMouseLeave={() => setHovered(0)}
        id={id}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            data-rating={star}
            className={`srv-star-btn ${displayed >= star ? 'active' : ''}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <FaStar />
          </button>
        ))}
      </div>

      {showLabel && (
        <p className="srv-rating-hint" id={`${id}Label`}>
          {value > 0
            ? `${RATING_LABELS[value]} — ${value}/5`
            : 'Click a star to rate'}
        </p>
      )}
    </div>
  );
}