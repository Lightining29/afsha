import { useState, useEffect } from 'react';
import { X, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword, changePassword } from '../api';
import GoogleSignInButton from './GoogleSignInButton';
import './LoginModal.css';

export default function LoginModal({ onClose }) {
  const { login, register, loginWithGoogle, requirePasswordSetup, setRequirePasswordSetup } = useAuth();
  const [mode, setMode] = useState(requirePasswordSetup ? 'setup-password' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requirePasswordSetup) {
      setMode('setup-password');
    }
  }, [requirePasswordSetup]);

  const handleClose = () => {
    setRequirePasswordSetup(false);
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleGoogleSuccess = async (credential) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await loginWithGoogle(credential);
      onClose();
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (err) => {
    setError(err.message || 'Google Sign-In failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        const res = await register(name, email, password);
        if (res?.requireVerification) {
          setMessage('Account created! An OTP has been sent to your email to verify your account.');
          // Redirect standard verification to traditional login/OTP flow
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          // Logged in automatically (e.g. if auto-verify for specific emails)
          onClose();
        }
      } else if (mode === 'forgot') {
        if (forgotStep === 1) {
          const res = await forgotPassword(email);
          setMessage(res.message || 'Verification code sent to your email.');
          setForgotStep(2);
        } else {
          const res = await resetPassword(email, code, newPassword);
          // Logging in user using the returned auth token and data from reset response
          // We can just log them in using the standard login since we know the new password
          await login(email, newPassword);
          setMessage('Password reset successful! Logging you in...');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else if (mode === 'setup-password') {
        if (newPassword !== confirmPassword) {
          return setError('Passwords do not match');
        }
        if (newPassword.length < 6) {
          return setError('Password must be at least 6 characters');
        }
        await changePassword('', newPassword);
        setMessage('Password saved successfully!');
        setRequirePasswordSetup(false);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={handleModalClick}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-logo">
          <Droplets size={28} /> Glowora
        </div>

        {mode === 'login' && (
          <>
            <p className="modal-subtitle">Welcome back — sign in to your account</p>
            <form className="modal-form" onSubmit={handleSubmit}>
              {error && <div className="modal-error">{error}</div>}
              {message && <div className="modal-success">{message}</div>}

              <div className="form-group">
                <label htmlFor="modal-email">Email</label>
                <input
                  id="modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="modal-password" style={{ margin: 0 }}>Password</label>
                  <span className="modal-forgot-link" onClick={() => { setMode('forgot'); setForgotStep(1); setError(''); setMessage(''); }}>
                    Forgot Password?
                  </span>
                </div>
                <input
                  id="modal-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn btn-sky modal-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider">or</div>
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="signin_with" />

            <p className="modal-footer">
              Don't have an account? <span onClick={() => { setMode('register'); setError(''); setMessage(''); }}>Create one</span>
            </p>
          </>
        )}

        {mode === 'register' && (
          <>
            <p className="modal-subtitle">Create your Glowora account</p>
            <form className="modal-form" onSubmit={handleSubmit}>
              {error && <div className="modal-error">{error}</div>}
              {message && <div className="modal-success">{message}</div>}

              <div className="form-group">
                <label htmlFor="modal-name">Full Name</label>
                <input
                  id="modal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-email">Email</label>
                <input
                  id="modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-password">Password</label>
                <input
                  id="modal-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-sky modal-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-divider">or</div>
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="signup_with" />

            <p className="modal-footer">
              Already have an account? <span onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Sign in</span>
            </p>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <p className="modal-subtitle">
              {forgotStep === 1 ? 'Reset your password' : 'Enter reset code and new password'}
            </p>
            <form className="modal-form" onSubmit={handleSubmit}>
              {error && <div className="modal-error">{error}</div>}
              {message && <div className="modal-success">{message}</div>}

              {forgotStep === 1 ? (
                <div className="form-group">
                  <label htmlFor="modal-forgot-email">Email</label>
                  <input
                    id="modal-forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="modal-forgot-code">Verification Code (OTP)</label>
                    <input
                      id="modal-forgot-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-forgot-new-password">New Password</label>
                    <input
                      id="modal-forgot-new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-sky modal-submit" disabled={loading}>
                {loading
                  ? 'Processing...'
                  : forgotStep === 1
                  ? 'Send Verification Code'
                  : 'Update Password'}
              </button>
            </form>

            <p className="modal-footer">
              Remembered password? <span onClick={() => { setMode('login'); setError(''); setMessage(''); }}>Sign in</span>
            </p>
          </>
        )}

        {mode === 'setup-password' && (
          <>
            <p className="modal-subtitle">Set a password for your account</p>
            <p className="settings-help-text" style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--off-white)', padding: '10px 14px', borderLeft: '4px solid var(--sky-blue)', borderRadius: '4px' }}>
              Set a password below to allow logging in with your email and password in the future.
            </p>
            <form className="modal-form" onSubmit={handleSubmit}>
              {error && <div className="modal-error">{error}</div>}
              {message && <div className="modal-success">{message}</div>}

              <div className="form-group">
                <label htmlFor="modal-setup-password">New Password</label>
                <input
                  id="modal-setup-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-setup-confirm">Confirm Password</label>
                <input
                  id="modal-setup-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn btn-sky modal-submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
