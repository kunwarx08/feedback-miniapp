import React, { useState } from 'react';
import { signInUser, signUpUser } from '../services/supabase';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Auth component handles both Sign In and Sign Up modes with validation and error feedback.
 */
export function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Switch between Login and Sign Up tabs
  const handleTabChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  // Validate form fields
  const validateForm = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Check for dummy/unsupported test domains that fail Supabase backend MX deliverability checks
    const domain = trimmedEmail.split('@')[1]?.toLowerCase();
    if (domain === 'test.com' || domain === 'example.com' || domain === 'invalid') {
      setError('Supabase Auth requires a real email domain (e.g. name@gmail.com, student@university.edu). Dummy domains like @test.com or @example.com are rejected by Supabase deliverability checks.');
      return false;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    if (mode === 'login') {
      const { data, error: authError } = await signInUser({ email, password });
      setIsLoading(false);

      if (authError) {
        setError(authError.message || 'Invalid email or password.');
      } else if (data?.user) {
        onAuthSuccess(data.user);
      }
    } else {
      // Sign Up mode
      const { data, error: authError } = await signUpUser({ email, password });
      setIsLoading(false);

      if (authError) {
        let msg = authError.message || 'Could not complete sign up. Please try again.';
        if (msg.toLowerCase().includes('email address') && msg.toLowerCase().includes('invalid')) {
          msg = `${authError.message}. Supabase requires a deliverable email domain (e.g. student@gmail.com or student@university.edu). Fake domains like @test.com are rejected by server-side checks.`;
        } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('rate_limit') || authError.status === 429) {
          msg = 'Email rate limit exceeded (Supabase default email service limits to ~3 emails/hour). Fix: In your Supabase Dashboard under Authentication → Providers → Email, disable "Confirm email" for testing, or configure custom SMTP.';
        }
        setError(msg);
      } else if (data?.user) {
        if (data.session) {
          // Auto logged in (email confirmation disabled in Supabase)
          onAuthSuccess(data.user);
        } else {
          // Email confirmation is required by Supabase project settings
          setSuccessMessage('Account created! Please check your email inbox to confirm your account before logging in.');
          setMode('login');
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Auth Header */}
        <div className="auth-header">
          <div className="app-badge" style={{ marginBottom: '0.5rem' }}>
            🎓 Student Portal
          </div>
          <h2>Welcome to Feedback Collector</h2>
          <p>Sign in to submit course reviews and view your feedback history</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
            type="button"
          >
            <LogIn size={16} />
            Log In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
            type="button"
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="alert-banner" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div className="alert-banner" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up Mode Only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="auth-confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              'Processing...'
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                Log In
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => handleTabChange(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign Up here' : 'Log In here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
