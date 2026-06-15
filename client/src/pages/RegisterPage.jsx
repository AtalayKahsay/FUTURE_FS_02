import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPage.css';
const RegisterPage = () => {
  const [form,setForm]=useState({name:'',email:'',password:'',confirm:''});
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);
  const {register}=useAuth(); const navigate=useNavigate();
  const handleChange=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleSubmit=async e=>{e.preventDefault();if(!form.name||!form.email||!form.password)return toast.error('All fields required.');if(form.password.length<6)return toast.error('Min 6 characters.');if(form.password!==form.confirm)return toast.error("Passwords don't match.");setLoading(true);try{await register(form.name,form.email,form.password);toast.success('Account created!');navigate('/dashboard');}catch(err){toast.error(err.response?.data?.message||'Registration failed.');}finally{setLoading(false);}};
  return (
    <div className="auth-page"><div className="auth-card">
      <div className="auth-logo"><div className="auth-logo__icon">C</div><div><p className="auth-logo__name">Mini CRM</p><p className="auth-logo__tag">Lead Management System</p></div></div>
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-subtitle">Start managing your leads in minutes.</p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field"><label className="auth-label">Full Name</label>
          <div className="auth-input-wrapper"><MdPerson className="auth-input-icon" size={18}/><input type="text" name="name" className="auth-input" placeholder="John Doe" value={form.name} onChange={handleChange}/></div>
        </div>
        <div className="auth-field"><label className="auth-label">Email</label>
          <div className="auth-input-wrapper"><MdEmail className="auth-input-icon" size={18}/><input type="email" name="email" className="auth-input" placeholder="you@company.com" value={form.email} onChange={handleChange}/></div>
        </div>
        <div className="auth-field"><label className="auth-label">Password</label>
          <div className="auth-input-wrapper"><MdLock className="auth-input-icon" size={18}/>
            <input type={showPw?'text':'password'} name="password" className="auth-input auth-input--password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange}/>
            <button type="button" className="auth-input-toggle" onClick={()=>setShowPw(p=>!p)}>{showPw?<MdVisibilityOff size={18}/>:<MdVisibility size={18}/>}</button>
          </div>
        </div>
        <div className="auth-field"><label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrapper"><MdLock className="auth-input-icon" size={18}/><input type={showPw?'text':'password'} name="confirm" className="auth-input" placeholder="Re-enter password" value={form.confirm} onChange={handleChange}/></div>
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>{loading?<span className="auth-spinner"/>:'Create Account'}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
    </div></div>
  );
};
export default RegisterPage;
