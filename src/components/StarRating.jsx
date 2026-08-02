import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component
 * Supports both interactive rating input (for forms) and read-only star display (for cards).
 * 
 * @param {number} rating - Selected or display rating (1-5)
 * @param {Function} onRatingChange - Callback triggered when a star is clicked
 * @param {boolean} readOnly - If true, star selection is disabled
 */
export function StarRating({ rating = 0, onRatingChange, readOnly = false }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const starLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  // If read-only, render simple static star list
  if (readOnly) {
    return (
      <div className="card-rating" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            fill={star <= rating ? '#f59e0b' : 'transparent'}
            color={star <= rating ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={star <= rating ? 0 : 1.5}
          />
        ))}
      </div>
    );
  }

  // Interactive mode for the feedback form
  const activeRating = hoveredRating || rating;

  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= activeRating ? 'active' : ''}`}
          onClick={() => onRatingChange && onRatingChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={26}
            fill={star <= activeRating ? '#f59e0b' : 'transparent'}
            color={star <= activeRating ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={star <= activeRating ? 0 : 1.5}
          />
        </button>
      ))}

      {activeRating > 0 && (
        <span className="rating-label-text">
          {starLabels[activeRating]} ({activeRating}/5)
        </span>
      )}
    </div>
  );
}
