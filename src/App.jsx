import React, { useState, useEffect, useCallback } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { Toast } from './components/Toast';
import { fetchFeedback, createFeedback, isSupabaseConfigured } from './services/supabase';
import { GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

export function App() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch all feedback from Supabase
  const loadFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchFeedback();

    if (fetchError) {
      setError(fetchError);
    } else {
      setFeedbackList(data || []);
    }

    setIsLoading(false);
  }, []);

  // Initial load on component mount
  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  // Handle form submission
  const handleSubmitFeedback = async (formData) => {
    setIsSubmitting(true);
    const { data, error: submitError } = await createFeedback(formData);
    setIsSubmitting(false);

    if (submitError) {
      setToast({
        type: 'error',
        message: submitError.message || 'Failed to submit feedback. Please try again.'
      });
      return false;
    }

    // Success feedback submission
    setToast({
      type: 'success',
      message: 'Feedback submitted successfully! Thank you.'
    });

    // Automatically refresh feedback list to include newly created entry
    await loadFeedback();
    return true;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-badge">
          <GraduationCap size={16} />
          Student Portal
        </div>
        <h1 className="app-title">Student Feedback Collector</h1>
        <p className="app-subtitle">
          Share your course experiences and view real-time student reviews
        </p>
      </header>

      {/* Warning Banner if Supabase Environment Variables are missing */}
      {!isSupabaseConfigured && (
        <div className="alert-banner">
          <AlertCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Database Not Connected:</strong> You are viewing the app without active Supabase credentials.
            To connect to your PostgreSQL database, copy <code>.env.example</code> to <code>.env</code> and add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
          </div>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <main className="main-layout">
        {/* Left Column: Form */}
        <section aria-labelledby="form-heading">
          <FeedbackForm
            onSubmit={handleSubmitFeedback}
            isSubmitting={isSubmitting}
          />
        </section>

        {/* Right Column: Feedback List */}
        <section aria-labelledby="list-heading">
          <FeedbackList
            feedbackList={feedbackList}
            isLoading={isLoading}
            error={error}
            onRefresh={loadFeedback}
          />
        </section>
      </main>

      {/* Toast Notification Popup */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Student Feedback Collector &copy; {new Date().getFullYear()} &bull; Built with React, Vite & Supabase
        </p>
      </footer>
    </div>
  );
}

export default App;
