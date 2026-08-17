import { useEffect, useRef } from 'react';
import './GoogleSignInButton.css';

export default function GoogleSignInButton({ onSuccess, onError, text = 'signin_with' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let script = document.getElementById('google-gsi-client');
    
    const initializeGoogleSignIn = () => {
      try {
        if (!window.google) return;
        
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '798271672760-tsfmas0ibge6te3532tuhn8btkv3q6ad.apps.googleusercontent.com',
          callback: (res) => {
            if (res.credential) {
              onSuccess(res.credential);
            } else {
              onError?.(new Error('No credential returned from Google'));
            }
          },
        });

        if (containerRef.current) {
          window.google.accounts.id.renderButton(
            containerRef.current,
            { 
              theme: 'outline', 
              size: 'large', 
              width: '320',
              text: text 
            }
          );
        }
      } catch (err) {
        onError?.(err);
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-gsi-client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        script.addEventListener('load', initializeGoogleSignIn);
      }
    }

    return () => {
      const activeScript = document.getElementById('google-gsi-client');
      if (activeScript) {
        activeScript.removeEventListener('load', initializeGoogleSignIn);
      }
    };
  }, [onSuccess, onError, text]);

  return (
    <div className="google-btn-wrapper">
      {/* Google's official hidden button */}
      <div ref={containerRef} className="google-official-btn-container" />
      
      {/* Our custom attractive neumorphic button */}
      <div className="google-neumorphic-btn">
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
          <path
            fill="#EA4335"
            d="M9 3.6c1.62 0 2.23.7 2.64 1.15l1.98-1.98C12.38 1.62 10.87 1 9 1 5.76 1 3 3.24 2 6.17l2.45 1.9C5.03 5.37 6.84 3.6 9 3.6z"
          />
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.59-.05-1.17-.16-1.73H9v3.28h4.84c-.21 1.1-.83 2.03-1.76 2.66l2.73 2.11c1.6-1.48 2.53-3.65 2.53-6.32z"
          />
          <path
            fill="#FBBC05"
            d="M4.45 10.73c-.2-.59-.31-1.22-.31-1.87s.11-1.28.31-1.87L2 5.09C1.36 6.37 1 7.8 1 9.3s.36 2.93 1 4.21l2.45-1.91z"
          />
          <path
            fill="#34A853"
            d="M9 17c2.16 0 3.97-.72 5.3-1.95l-2.73-2.11c-.76.51-1.73.82-2.57.82-2.16 0-3.97-1.77-4.55-4.47L2 11.2C3 14.13 5.76 17 9 17z"
          />
        </svg>
        <span>{text === 'signup_with' ? 'Sign up with Google' : 'Sign in with Google'}</span>
      </div>
    </div>
  );
}
