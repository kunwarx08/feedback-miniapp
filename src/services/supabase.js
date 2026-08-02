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

/* ==========================================================================
   AUTHENTICATION SERVICE METHODS
   ========================================================================== */

/**
 * Sign up a new user with email and password.
 * @param {Object} credentials - { email, password }
 */
export async function signUpUser({ email, password }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim()
    });

    if (error) {
      console.error('Supabase sign up error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { data: null, error: err };
  }
}

/**
 * Sign in an existing user with email and password.
 * @param {Object} credentials - { email, password }
 */
export async function signInUser({ email, password }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    });

    if (error) {
      console.error('Supabase sign in error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { data: null, error: err };
  }
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser() {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase is not configured.') };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase sign out error:', error);
    return { error };
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    return { error: err };
  }
}

/* ==========================================================================
   DATABASE SERVICE METHODS (FULL CRUD)
   ========================================================================== */

/**
 * 1. READ: Fetch feedback for the currently authenticated user.
 * Row Level Security (RLS) automatically filters results to match auth.uid() = user_id.
 */
export async function fetchFeedback() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.')
    };
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      let customError = error;
      if (error.message && error.message.toLowerCase().includes('user_id')) {
        customError = new Error("Database schema out of date: The 'feedback' table is missing the 'user_id' column. Please run the SQL script from `supabase/schema.sql` in your Supabase SQL Editor.");
      }
      return { data: null, error: customError };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching feedback:', err);
    return { data: null, error: err };
  }
}

/**
 * 2. CREATE: Insert a new feedback entry associated with the current user.
 * @param {Object} feedbackData - { name, course, rating, feedback }
 */
export async function createFeedback({ name, course, rating, feedback }) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error('Supabase is not configured. Please check your environment variables.')
    };
  }

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: new Error('You must be logged in to submit feedback.') };
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: user.id,
          name: name.trim(),
          course: course.trim(),
          rating: Number(rating),
          feedback: feedback.trim()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      let customError = error;
      if (error.message && error.message.toLowerCase().includes('user_id')) {
        customError = new Error("Database schema out of date: The 'feedback' table is missing the 'user_id' column. Please run the SQL migration script in your Supabase SQL Editor.");
      }
      return { data: null, error: customError };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating feedback:', err);
    return { data: null, error: err };
  }
}

/**
 * 3. UPDATE: Modify an existing feedback entry owned by the authenticated user.
 * @param {string} id - UUID of the feedback item to update
 * @param {Object} updatedFields - { name, course, rating, feedback }
 */
export async function updateFeedback(id, { name, course, rating, feedback }) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({
        name: name.trim(),
        course: course.trim(),
        rating: Number(rating),
        feedback: feedback.trim()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating feedback:', err);
    return { data: null, error: err };
  }
}

/**
 * 4. DELETE: Remove a feedback entry owned by the authenticated user.
 * @param {string} id - UUID of the feedback item to delete
 */
export async function deleteFeedback(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase is not configured.') };
  }

  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error deleting feedback:', err);
    return { error: err };
  }
}
