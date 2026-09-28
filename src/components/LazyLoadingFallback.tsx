import React from 'react';

/**
 * Loading spinner shown while lazy-loaded components are being imported
 * Matches the design system's color palette and aesthetic
 */
export function LazyLoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#c2b8a6',
    }}>
      <div style={{
        textAlign: 'center',
      }}>
        {/* Animated spinner */}
        <div style={{
          width: 48,
          height: 48,
          margin: '0 auto 24px',
          position: 'relative',
        }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '2px solid rgba(212,160,74,0.2)',
              borderTop: '2px solid rgba(212,160,74,0.8)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* Loading text */}
        <p style={{
          fontSize: '0.95rem',
          margin: 0,
          color: '#c2b8a6',
          letterSpacing: '0.04em',
        }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
