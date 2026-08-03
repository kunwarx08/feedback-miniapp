import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { Toast } from './components/Toast';
import { supabase, isSupabaseConfigured } from './services/supabase';
import {
  fetchFeedbackApi,
  createFeedbackApi,
  updateFeedbackApi,
  deleteFeedbackApi
} from './services/api';
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

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // READ: Fetch feedback entries from FastAPI REST backend
  const loadFeedback = useCallback(async () => {
    if (!user) return;

    setIsLoadingFeedback(true);
    setFeedbackError(null);

    const { data, error } = await fetchFeedbackApi();

    if (error) {
      setFeedbackError(error);
    } else {
      setFeedbackList(data || []);
    }

    setIsLoadingFeedback(false);
  }, [user]);

  // Reload feedback when authenticated user logs in
  useEffect(() => {
    if (user) {
      loadFeedback();
    } else {
      setFeedbackList([]);
    }
  }, [user, loadFeedback]);

  // CREATE: Submit feedback via FastAPI REST backend
  const handleSubmitFeedback = async (formData) => {
    setIsSubmitting(true);
    const { error: submitError } = await createFeedbackApi(formData);
    setIsSubmitting(false);

    if (submitError) {
      setToast({
        type: 'error',
        message: submitError.message || 'Failed to submit feedback via API.'
      });
      return false;
    }

    setToast({
      type: 'success',
      message: 'Feedback submitted successfully via FastAPI!'
    });

    await loadFeedback();
    return true;
  };

  // UPDATE: Modify feedback via FastAPI REST backend
  const handleUpdateFeedback = async (id, updatedFields) => {
    const { error: updateErr } = await updateFeedbackApi(id, updatedFields);

    if (updateErr) {
      setToast({
        type: 'error',
        message: updateErr.message || 'Failed to update feedback via API.'
      });
      return false;
    }

    setToast({
      type: 'success',
      message: 'Feedback updated successfully!'
    });

    await loadFeedback();
    return true;
  };

  // DELETE: Remove feedback via FastAPI REST backend
  const handleDeleteFeedback = async (id) => {
    const { error: deleteErr } = await deleteFeedbackApi(id);

    if (deleteErr) {
      setToast({
        type: 'error',
        message: deleteErr.message || 'Failed to delete feedback via API.'
      });
      return false;
    }

    setToast({
      type: 'success',
      message: 'Feedback deleted successfully!'
    });

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

  // 4. Authenticated State -> Show Main App & FastAPI REST Feedback Dashboard
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
            onUpdate={handleUpdateFeedback}
            onDelete={handleDeleteFeedback}
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
          Student Feedback Collector &copy; {new Date().getFullYear()} &bull; Version 4 (FastAPI + Render 3-Tier Architecture)
        </p>
      </footer>
    </div>
  );
}

export default App;
