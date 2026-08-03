import { supabase } from './supabase';

// Base FastAPI backend URL configured via environment variable (or localhost default)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * Retrieves the current authenticated user's JWT access token from Supabase session.
 * @returns {Promise<string|null>} Bearer access token
 */
async function getAuthToken() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Helper function to create HTTP headers with JWT Bearer token authentication.
 */
async function getAuthHeaders() {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

/**
 * 1. READ: Fetch feedback entries from FastAPI REST backend.
 */
export async function fetchFeedbackApi() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server returned status ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API fetch error:', error);
    return { data: null, error };
  }
}

/**
 * 2. CREATE: Submit new feedback entry to FastAPI REST backend.
 */
export async function createFeedbackApi({ name, course, rating, feedback }) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, course, rating: Number(rating), feedback })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to create feedback (${response.status})`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API create error:', error);
    return { data: null, error };
  }
}

/**
 * 3. UPDATE: Modify an existing feedback entry via FastAPI REST backend.
 */
export async function updateFeedbackApi(id, { name, course, rating, feedback }) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ name, course, rating: Number(rating), feedback })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update feedback (${response.status})`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API update error:', error);
    return { data: null, error };
  }
}

/**
 * 4. DELETE: Remove a feedback entry via FastAPI REST backend.
 */
export async function deleteFeedbackApi(id) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to delete feedback (${response.status})`);
    }

    return { error: null };
  } catch (error) {
    console.error('API delete error:', error);
    return { error };
  }
}
