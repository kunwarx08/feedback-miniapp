import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { Send, RotateCcw, MessageSquarePlus, AlertCircle } from 'lucide-react';

const INITIAL_FORM_STATE = {
  name: '',
  course: '',
  rating: 0,
  feedback: ''
};

/**
 * FeedbackForm component handles user input, local state validation, and form submission.
 */
export function FeedbackForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error state for field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle rating change from StarRating component
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student Name is required';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course name is required';
    }

    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = 'Please select a star rating (1–5 stars)';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback text is required';
    } else if (formData.feedback.trim().length < 5) {
      newErrors.feedback = 'Feedback should be at least 5 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, course: true, rating: true, feedback: true });

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Clear form on successful submission
      handleReset();
    }
  };

  // Handle form reset button
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="card-wrapper">
      <div className="form-header">
        <h2 className="form-title">
          <MessageSquarePlus color="#6366f1" size={24} />
          Submit Feedback
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
          Share your experience to help improve future course modules.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Student Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Student Name <span className="required-star">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'has-error' : ''}`}
            placeholder="e.g. Alex Johnson"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className="error-message">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {errors.name}
            </span>
          )}
        </div>

        {/* Course Name */}
        <div className="form-group">
          <label htmlFor="course" className="form-label">
            Course <span className="required-star">*</span>
          </label>
          <input
            id="course"
            name="course"
            type="text"
            className={`form-input ${errors.course ? 'has-error' : ''}`}
            placeholder="e.g. Web Development 101, Computer Science 102"
            value={formData.course}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.course && (
            <span className="error-message">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {errors.course}
            </span>
          )}
        </div>

        {/* Star Rating */}
        <div className="form-group">
          <label className="form-label">
            Course Rating <span className="required-star">*</span>
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
          />
          {errors.rating && (
            <span className="error-message">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {errors.rating}
            </span>
          )}
        </div>

        {/* Feedback Text */}
        <div className="form-group">
          <label htmlFor="feedback" className="form-label">
            Your Feedback <span className="required-star">*</span>
          </label>
          <textarea
            id="feedback"
            name="feedback"
            className={`form-textarea ${errors.feedback ? 'has-error' : ''}`}
            placeholder="Write your honest feedback, comments, or suggestions here..."
            value={formData.feedback}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={4}
          />
          {errors.feedback && (
            <span className="error-message">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {errors.feedback}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
