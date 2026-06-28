import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../api';
import './AccountSettings.css';

export default function AccountSettings() {
  const { user, updateProfile } = useAuth();
  
  // Profile info states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [stateVal, setStateVal] = useState(user?.state || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');

  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setStateVal(user.state || '');
      setZipCode(user.zipCode || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await updateProfile({
        name,
        phone,
        address,
        city,
        state: stateVal,
        zipCode
      });
      setProfileSuccess('Profile details saved successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile details');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-settings-container">
      <h1 className="panel-title">Account Settings</h1>
      
      <div className="profile-summary-card">
        <h3>Profile Settings</h3>
        
        {user?.googleId && (
          <div className="profile-badge" style={{ marginBottom: '8px' }}>
            ✓ Connected with Google ({user.email})
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="settings-form">
          {profileError && <div className="settings-error">{profileError}</div>}
          {profileSuccess && <div className="settings-success">{profileSuccess}</div>}

          <div className="form-group">
            <label htmlFor="settings-name">Full Name</label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-phone">Phone Number</label>
            <input
              id="settings-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-address">Address</label>
            <input
              id="settings-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Street, Locality"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="settings-city">City</label>
              <input
                id="settings-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label htmlFor="settings-state">State</label>
              <input
                id="settings-state"
                type="text"
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="settings-zip">Zip / Postal Code</label>
            <input
              id="settings-zip"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip Code"
            />
          </div>

          <button type="submit" className="btn btn-sky settings-submit" disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </div>

      <div className="password-change-card">
        <h3>Change Password</h3>
        
        {user?.googleId && !currentPassword && (
          <p className="settings-help-text">
            You registered via Google. You can set a password below to allow logging in with your email and password as well.
          </p>
        )}

        <form onSubmit={handlePasswordSubmit} className="settings-form">
          {error && <div className="settings-error">{error}</div>}
          {success && <div className="settings-success">{success}</div>}

          {!user?.googleId && (
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-sky settings-submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
