import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Toast alert notification component.
 */
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      {isSuccess ? (
        <CheckCircle2 size={20} style={{ color: '#34d399' }} />
      ) : (
        <AlertCircle size={20} style={{ color: '#f87171' }} />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
