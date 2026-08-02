import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables configured in Vite (.env file or deployment platform)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are set and not placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-actual-anon-key-here'
);

// Initialize the Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all feedback entries from Supabase, ordered by created_at descending (newest first).
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function fetchFeedback() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
    };
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching feedback:', err);
    return { data: null, error: err };
  }
}

/**
 * Insert a new feedback record into Supabase.
 * @param {Object} feedbackData - { name, course, rating, feedback }
 * @returns {Promise<{ data: Array|null, error: Error|null }>}
 */
export async function createFeedback({ name, course, rating, feedback }) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please check your environment variables.')
    };
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          name: name.trim(),
          course: course.trim(),
          rating: Number(rating),
          feedback: feedback.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating feedback:', err);
    return { data: null, error: err };
  }
}
