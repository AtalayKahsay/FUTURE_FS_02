import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdArrowBack } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AuthPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email.');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed. Try again.');
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

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">We sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="auth-btn" style={{ display:'flex', marginTop: 24, textDecoration:'none', justifyContent:'center' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <MdEmail className="auth-input-icon" size={18} />
                  <input
                    type="email" className="auth-input"
                    placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <p className="auth-switch">
          <Link to="/login" className="auth-link" style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center' }}>
            <MdArrowBack size={16} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;