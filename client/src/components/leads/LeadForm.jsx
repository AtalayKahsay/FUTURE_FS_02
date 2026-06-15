import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdPhone, MdBusiness, MdSave, MdArrowBack } from 'react-icons/md';
import './LeadForm.css';

const SOURCES = ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'other'];
const STATUSES = ['new', 'contacted', 'converted', 'lost'];
const PRIORITIES = ['low', 'medium', 'high'];
const EMPTY = { name:'', email:'', phone:'', company:'', source:'website', status:'new', priority:'medium', value:'', followUpDate:'', tags:'' };

const LeadForm = ({ initialData={}, onSubmit, submitLabel='Save', loading=false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({
      ...form,
      value: form.value ? Number(form.value) : 0,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      followUpDate: form.followUpDate || null,
    });
  };

  return (
    <div className="lf-page"><div className="lf-card"><form className="lf-form" onSubmit={handleSubmit} noValidate>
      <div className="lf-section">
        <h3 className="lf-title">Basic Information</h3>
        <div className="lf-grid">
          <div className={`lf-field${errors.name ? ' lf-field--err' : ''}`}>
            <label className="lf-label">Full Name *</label>
            <div className="lf-wrap"><MdPerson className="lf-icon" size={16}/><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="lf-input"/></div>
            {errors.name && <p className="lf-error">{errors.name}</p>}
          </div>
          <div className={`lf-field${errors.email ? ' lf-field--err' : ''}`}>
            <label className="lf-label">Email *</label>
            <div className="lf-wrap"><MdEmail className="lf-icon" size={16}/><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@co.com" className="lf-input"/></div>
            {errors.email && <p className="lf-error">{errors.email}</p>}
          </div>
          <div className="lf-field"><label className="lf-label">Phone</label>
            <div className="lf-wrap"><MdPhone className="lf-icon" size={16}/><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="lf-input"/></div>
          </div>
          <div className="lf-field"><label className="lf-label">Company</label>
            <div className="lf-wrap"><MdBusiness className="lf-icon" size={16}/><input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" className="lf-input"/></div>
          </div>
        </div>
      </div>
      <div className="lf-section">
        <h3 className="lf-title">Lead Details</h3>
        <div className="lf-grid lf-grid--3">
          <div className="lf-field"><label className="lf-label">Source</label>
            <select name="source" value={form.source} onChange={handleChange} className="lf-select">{SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}</select>
          </div>
          <div className="lf-field"><label className="lf-label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="lf-select">{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div className="lf-field"><label className="lf-label">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="lf-select">{PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}</select>
          </div>
          <div className="lf-field"><label className="lf-label">Estimated Value ($)</label>
            <input type="number" name="value" value={form.value} onChange={handleChange} placeholder="0" className="lf-input lf-input--plain" min="0"/>
          </div>
          <div className="lf-field"><label className="lf-label">Follow-up Date</label>
            <input type="date" name="followUpDate" value={form.followUpDate ? form.followUpDate.slice(0, 10) : ''} onChange={handleChange} className="lf-input lf-input--plain"/>
          </div>
          <div className="lf-field"><label className="lf-label">Tags (comma-separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="hot, enterprise" className="lf-input lf-input--plain"/>
          </div>
        </div>
      </div>
      <div className="lf-actions">
        <button type="button" className="lf-btn-cancel" onClick={() => navigate(-1)}><MdArrowBack size={16}/>Cancel</button>
        <button type="submit" className="lf-btn-submit" disabled={loading}>{loading ? <span className="lf-spinner"/> : <><MdSave size={16}/>{submitLabel}</>}</button>
      </div>
    </form></div></div>
  );
};

export default LeadForm;