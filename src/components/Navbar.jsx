import React from 'react';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { signOutUser } from '../services/supabase';

/**
 * Navbar component displays the application header, current authenticated user email, and logout action.
 */
export function Navbar({ user, onLogout }) {
  const handleLogout = async () => {
    await signOutUser();
    if (onLogout) onLogout();
  };

  return (
    <nav className="app-navbar">
      <div className="nav-brand">
        <GraduationCap size={28} className="nav-logo" />
        <span className="nav-title">Student Feedback Collector</span>
      </div>

      {user && (
        <div className="nav-user-controls">
          <div className="user-badge" title={`Logged in as ${user.email}`}>
            <User size={14} />
            <span className="user-email">{user.email}</span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            title="Log out of your account"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
