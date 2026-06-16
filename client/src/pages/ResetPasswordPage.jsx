import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AuthPage.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Min 6 characters.');
    if (form.password !== form.confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo__icon">C</div>
          <div><p className="auth-logo__name">Mini CRM</p><p className="auth-logo__tag">Lead Management System</p></div>
        </div>
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your new password below.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label">New Password</label>
            <div className="auth-input-wrapper">
              <MdLock className="auth-input-icon" size={18} />
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input auth-input--password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPw(p => !p)}>
                {showPw ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrapper">
              <MdLock className="auth-input-icon" size={18} />
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;