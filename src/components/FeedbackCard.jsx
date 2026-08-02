import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { Calendar, User, BookOpen, Edit2, Trash2, Check, X } from 'lucide-react';

/**
 * Formats an ISO date string into a human-readable date and time.
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
 * FeedbackCard component renders individual feedback cards with inline edit mode and delete functionality.
 */
export function FeedbackCard({ item, onUpdate, onDelete }) {
  const { id, name, course, rating, feedback, created_at } = item;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: name || '',
    course: course || '',
    rating: rating || 5,
    feedback: feedback || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState('');

  // Handle edit form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditError('');
  };

  // Handle Save Edit
  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.course.trim() || !editForm.feedback.trim()) {
      setEditError('All fields (Name, Course, Rating, Feedback) are required.');
      return;
    }

    setIsSaving(true);
    const success = await onUpdate(id, editForm);
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  // Handle Cancel Edit
  const handleCancel = () => {
    setEditForm({ name, course, rating, feedback });
    setEditError('');
    setIsEditing(false);
  };

  // Handle Delete Confirmation
  const handleDeleteClick = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the feedback for "${course}"?`);
    if (!confirmed) return;

    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  // RENDER INLINE EDIT MODE
  if (isEditing) {
    return (
      <div className="feedback-card edit-mode-card">
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#4f46e5', marginBottom: '0.5rem' }}>
          Editing Feedback
        </div>

        {editError && (
          <div className="error-message" style={{ marginBottom: '0.5rem' }}>
            {editError}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Student Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={editForm.name}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Course</label>
          <input
            type="text"
            name="course"
            className="form-input"
            value={editForm.course}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Rating</label>
          <StarRating
            rating={editForm.rating}
            onRatingChange={(newRating) => setEditForm((prev) => ({ ...prev, rating: newRating }))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Feedback</label>
          <textarea
            name="feedback"
            className="form-textarea"
            rows={3}
            value={editForm.feedback}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <div className="form-actions" style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Check size={14} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSaving}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // RENDER NORMAL CARD DISPLAY MODE
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          {/* Read-Only Star Rating */}
          <StarRating rating={rating} readOnly />

          {/* Action Buttons: Edit and Delete */}
          <div className="card-actions">
            <button
              type="button"
              className="btn-card-action btn-edit"
              onClick={() => setIsEditing(true)}
              title="Edit this feedback"
              aria-label="Edit feedback"
            >
              <Edit2 size={14} />
              Edit
            </button>
            <button
              type="button"
              className="btn-card-action btn-delete"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete this feedback"
              aria-label="Delete feedback"
            >
              <Trash2 size={14} />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
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
