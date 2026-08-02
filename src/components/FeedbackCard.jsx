import React from 'react';
import { StarRating } from './StarRating';
import { Calendar, User, BookOpen } from 'lucide-react';

/**
 * Formats an ISO date string into a human-readable date and time.
 * @param {string} dateString 
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * FeedbackCard component displays an individual student feedback submission.
 */
export function FeedbackCard({ item }) {
  const { name, course, rating, feedback, created_at } = item;

  return (
    <div className="feedback-card">
      <div className="card-top">
        <div>
          <h3 className="student-name" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} className="text-muted" />
            {name}
          </h3>
          <span className="course-tag">
            <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {course}
          </span>
        </div>
        
        {/* Star Rating Display */}
        <StarRating rating={rating} readOnly />
      </div>

      <div className="card-body">
        <p>{feedback}</p>
      </div>

      <div className="card-footer">
        <Calendar size={13} />
        <span>Submitted on {formatDate(created_at)}</span>
      </div>
    </div>
  );
}
