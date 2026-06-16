import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const [pwForm, setPwForm]     = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async e => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('Min 6 characters.');
    if (pwForm.newPassword !== pwForm.confirm) return toast.error("Passwords don't match.");
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed!');
      setPwForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="settings-page">
      {/* Account Info */}
      <div className="settings-card">
        <h3 className="settings-card-title">Account Information</h3>
        <div className="settings-info-grid">
          <div className="settings-info-item">
            <p className="settings-info-label">Full Name</p>
            <p className="settings-info-value">{user?.name}</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Email</p>
            <p className="settings-info-value">{user?.email}</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Role</p>
            <p className="settings-info-value" style={{ textTransform:'capitalize' }}>{user?.role}</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Status</p>
            <p className="settings-info-value" style={{ color:'var(--color-converted)', fontWeight:700 }}>Active</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="settings-card">
        <h3 className="settings-card-title">Change Password</h3>
        <p className="settings-card-sub">Update your password to keep your account secure.</p>
        <form className="settings-form" onSubmit={handleChangePassword}>
          <div className="settings-field">
            <label>Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="settings-field">
            <label>New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <div className="settings-field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Re-enter new password"
              required
            />
          </div>
          <button type="submit" className="settings-btn" disabled={pwLoading}>
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* System Info */}
      <div className="settings-card">
        <h3 className="settings-card-title">System Information</h3>
        <div className="settings-info-grid">
          <div className="settings-info-item">
            <p className="settings-info-label">Application</p>
            <p className="settings-info-value">Mini CRM v2.0</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Stack</p>
            <p className="settings-info-value">MERN (MongoDB, Express, React, Node)</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Frontend</p>
            <p className="settings-info-value">React 19 + Vite</p>
          </div>
          <div className="settings-info-item">
            <p className="settings-info-label">Backend</p>
            <p className="settings-info-value">Node.js + Express</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;