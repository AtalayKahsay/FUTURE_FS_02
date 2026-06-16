import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPage.css';
const LoginPage = () => {
  const [form,setForm]=useState({email:'',password:''});
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);
  const {login}=useAuth(); const navigate=useNavigate();
  const handleChange=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleSubmit=async e=>{e.preventDefault();if(!form.email||!form.password)return toast.error('Fill all fields.');setLoading(true);try{await login(form.email,form.password);toast.success('Welcome back!');navigate('/dashboard');}catch(err){toast.error(err.response?.data?.message||'Login failed.');}finally{setLoading(false);}};
  return (
    <div className="auth-page"><div className="auth-card">
      <div className="auth-logo"><div className="auth-logo__icon">C</div><div><p className="auth-logo__name">Mini CRM</p><p className="auth-logo__tag">Lead Management System</p></div></div>
      <h2 className="auth-title">Sign in to your account</h2>
      <p className="auth-subtitle">Welcome back! Enter your credentials below.</p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field"><label className="auth-label">Email</label>
          <div className="auth-input-wrapper"><MdEmail className="auth-input-icon" size={18}/>
            <input type="email" name="email" className="auth-input" placeholder="you@company.com" value={form.email} onChange={handleChange}/>
          </div>
        </div>
        <div className="auth-field"><label className="auth-label">Password</label>
          <div className="auth-input-wrapper"><MdLock className="auth-input-icon" size={18}/>
            <input type={showPw?'text':'password'} name="password" className="auth-input auth-input--password" placeholder="Your password" value={form.password} onChange={handleChange}/>
            <button type="button" className="auth-input-toggle" onClick={()=>setShowPw(p=>!p)}>{showPw?<MdVisibilityOff size={18}/>:<MdVisibility size={18}/>}</button>
          </div>
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>{loading?<span className="auth-spinner"/>:'Sign In'}</button>
      </form>
      <p className="auth-switch">
        <Link to="/forgot-password" className="auth-link">Forgot your password?</Link>
      </p>
    </div></div>
  );
};
export default LoginPage;
