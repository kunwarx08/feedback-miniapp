import React from 'react';
import { FeedbackCard } from './FeedbackCard';
import { RefreshCw, MessageSquare, AlertTriangle, Inbox } from 'lucide-react';

/**
 * FeedbackList component renders all submitted feedback cards with full CRUD callbacks.
 */
export function FeedbackList({ feedbackList, isLoading, error, onRefresh, onUpdate, onDelete }) {
  return (
    <div>
      {/* Header with counter and refresh button */}
      <div className="list-header">
        <h2 className="list-title">
          <MessageSquare color="#6366f1" size={24} />
          Student Reviews
          {!isLoading && !error && (
            <span className="count-badge">
              {feedbackList.length}
            </span>
          )}
        </h2>

        <button
          className="btn-icon"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh feedback list"
          aria-label="Refresh feedback list"
        >
          <RefreshCw size={18} className={isLoading ? 'spin-animation' : ''} />
        </button>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="feedback-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-line" style={{ width: '40%', height: '20px' }}></div>
                <div className="skeleton-line" style={{ width: '25%', height: '16px' }}></div>
              </div>
              <div className="skeleton-line" style={{ width: '30%', height: '14px' }}></div>
              <div className="skeleton-line" style={{ width: '100%', height: '40px' }}></div>
              <div className="skeleton-line" style={{ width: '50%', height: '12px' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="state-container">
          <AlertTriangle className="state-icon" style={{ color: '#ef4444' }} />
          <h3>Unable to Load Feedback</h3>
          <p style={{ maxWidth: '400px', fontSize: '0.9rem' }}>
            {error.message || 'An error occurred while connecting to the database.'}
          </p>
          <button className="btn btn-secondary" onClick={onRefresh} style={{ marginTop: '0.5rem' }}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && feedbackList.length === 0 && (
        <div className="state-container">
          <Inbox className="state-icon" />
          <h3>No Feedback Yet</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Submit feedback using the form on the left to see your reviews here!
          </p>
        </div>
      )}

      {/* Data List State */}
      {!isLoading && !error && feedbackList.length > 0 && (
        <div className="feedback-grid">
          {feedbackList.map((item) => (
            <FeedbackCard
              key={item.id || item.created_at}
              item={item}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
