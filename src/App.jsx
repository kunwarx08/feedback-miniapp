import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { Toast } from './components/Toast';
import { supabase, fetchFeedback, createFeedback, isSupabaseConfigured } from './services/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';

export function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [toast, setToast] = useState(null);

  // Initialize and listen to Supabase Auth State
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      return;
    }

    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    // 2. Listen for auth changes (login, logout, session refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch feedback for current authenticated user
  const loadFeedback = useCallback(async () => {
    if (!user) return;

    setIsLoadingFeedback(true);
    setFeedbackError(null);

    const { data, error } = await fetchFeedback();

    if (error) {
      setFeedbackError(error);
    } else {
      setFeedbackList(data || []);
    }

    setIsLoadingFeedback(false);
  }, [user]);

  // Load feedback whenever authenticated user changes or logs in
  useEffect(() => {
    if (user) {
      loadFeedback();
    } else {
      setFeedbackList([]);
    }
  }, [user, loadFeedback]);

  // Handle new feedback submission
  const handleSubmitFeedback = async (formData) => {
    setIsSubmitting(true);
    const { error: submitError } = await createFeedback(formData);
    setIsSubmitting(false);

    if (submitError) {
      setToast({
        type: 'error',
        message: submitError.message || 'Failed to submit feedback. Please try again.'
      });
      return false;
    }

    // Success notification
    setToast({
      type: 'success',
      message: 'Feedback submitted successfully!'
    });

    // Refresh feedback list
    await loadFeedback();
    return true;
  };

  // 1. Show loading spinner while checking auth session on startup
  if (isAuthLoading) {
    return (
      <div className="auth-loading-screen">
        <Loader2 className="spin-animation" size={36} color="#6366f1" />
        <p style={{ marginTop: '0.75rem', color: '#64748b', fontWeight: 500 }}>
          Initializing session...
        </p>
      </div>
    );
  }

  // 2. Unconfigured Supabase state
  if (!isSupabaseConfigured) {
    return (
      <div className="app-container">
        <div className="alert-banner" style={{ marginTop: '2rem' }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>Database Not Connected:</strong> Supabase environment variables are missing.
            Please configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env</code> file.
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthenticated State -> Show Auth Screen
  if (!user) {
    return (
      <div className="app-container">
        <Auth onAuthSuccess={(loggedInUser) => setUser(loggedInUser)} />
      </div>
    );
  }

  // 4. Authenticated State -> Show Main App & Feedback Dashboard
  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar user={user} onLogout={() => setUser(null)} />

      {/* Main Responsive Grid Layout */}
      <main className="main-layout" style={{ marginTop: '1rem' }}>
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
            isLoading={isLoadingFeedback}
            error={feedbackError}
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
          Student Feedback Collector &copy; {new Date().getFullYear()} &bull; Auth Enabled with Supabase RLS
        </p>
      </footer>
    </div>
  );
}

export default App;
