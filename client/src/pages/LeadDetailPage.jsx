import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdEdit, MdDelete, MdArrowBack, MdEmail, MdPhone, MdBusiness, MdSource, MdCalendarToday, MdAttachMoney, MdSend, MdNote, MdDeleteOutline } from 'react-icons/md';
import api from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './LeadDetailPage.css';

const LeadDetailPage = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [lead,setLead]=useState(null); const [loading,setLoading]=useState(true);
  const [noteText,setNoteText]=useState(''); const [addingNote,setAddingNote]=useState(false); const [deletingNote,setDeletingNote]=useState(null);

  const fetchLead = async () => { try { const {data}=await api.get(`/leads/${id}`); setLead(data.lead); } catch { toast.error('Lead not found.'); navigate('/leads'); } finally { setLoading(false); } };
  useEffect(()=>{fetchLead();},[id]);

  const handleDelete = async () => { if(!window.confirm('Delete this lead permanently?'))return; try { await api.delete(`/leads/${id}`); toast.success('Lead deleted.'); navigate('/leads'); } catch { toast.error('Failed.'); } };
  const handleAddNote = async e => { e.preventDefault(); if(!noteText.trim())return; setAddingNote(true); try { const {data}=await api.post(`/leads/${id}/notes`,{text:noteText.trim()}); setLead(p=>({...p,notes:data.notes})); setNoteText(''); toast.success('Note added.'); } catch { toast.error('Failed.'); } finally { setAddingNote(false); } };
  const handleDeleteNote = async noteId => { setDeletingNote(noteId); try { const {data}=await api.delete(`/leads/${id}/notes/${noteId}`); setLead(p=>({...p,notes:data.notes})); } catch { toast.error('Failed.'); } finally { setDeletingNote(null); } };

  if(loading) return <div className="detail-loading"><div className="detail-skel detail-skel--h"/><div className="detail-skel detail-skel--b"/></div>;
  if(!lead) return null;

  const infoItems = [
    {label:'Email',value:lead.email,icon:MdEmail,href:`mailto:${lead.email}`},
    {label:'Phone',value:lead.phone||'—',icon:MdPhone,href:lead.phone?`tel:${lead.phone}`:null},
    {label:'Company',value:lead.company||'—',icon:MdBusiness},
    {label:'Source',value:lead.source?.replace(/_/g,' '),icon:MdSource},
    {label:'Value',value:lead.value?`$${lead.value.toLocaleString()}`:'—',icon:MdAttachMoney},
    {label:'Follow-up',value:lead.followUpDate?lead.followUpDate.split('T')[0]:'—',icon:MdCalendarToday},
    {label:'Created',value:new Date(lead.createdAt).toLocaleDateString(),icon:MdCalendarToday},
    {label:'Created By',value:lead.createdBy?.name||'—',icon:MdNote},
  ];

  return (
    <div className="detail-page">
      <Link to="/leads" className="detail-back"><MdArrowBack size={16}/>Back to Leads</Link>
      <div className="detail-header-card">
        <div className="detail-header-left">
          <div className="detail-avatar">{lead.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="detail-name">{lead.name}</h2>
            <p className="detail-email-sub">{lead.email}</p>
            <div className="detail-badges"><StatusBadge status={lead.status}/><StatusBadge status={lead.priority} type="priority"/></div>
          </div>
        </div>
        <div className="detail-header-actions">
          <Link to={`/leads/${id}/edit`} className="detail-btn detail-btn--edit"><MdEdit size={16}/>Edit</Link>
          <button className="detail-btn detail-btn--delete" onClick={handleDelete}><MdDelete size={16}/>Delete</button>
        </div>
      </div>
      <div className="detail-body">
        <div className="detail-info-card">
          <h3 className="detail-section-title">Contact Information</h3>
          <div className="detail-info-grid">
            {infoItems.map(({label,value,icon:Icon,href})=>(
              <div key={label} className="detail-info-item">
                <div className="detail-info-icon"><Icon size={16}/></div>
                <div><p className="detail-info-label">{label}</p>
                  {href?<a href={href} className="detail-info-value detail-info-value--link">{value}</a>
                       :<p className="detail-info-value" style={{textTransform:label==='Source'?'capitalize':'none'}}>{value}</p>}
                </div>
              </div>
            ))}
          </div>
          {lead.tags?.length>0&&(
            <div className="detail-tags">
              <p className="detail-tags-label">Tags</p>
              <div className="detail-tags-list">{lead.tags.map(t=><span key={t} className="detail-tag">{t}</span>)}</div>
            </div>
          )}
        </div>
        <div className="detail-notes-card">
          <h3 className="detail-section-title">Notes & Follow-ups <span className="detail-notes-count">{lead.notes?.length||0}</span></h3>
          <form className="detail-add-note" onSubmit={handleAddNote}>
            <textarea className="detail-note-input" placeholder="Add a note or follow-up…" value={noteText} onChange={e=>setNoteText(e.target.value)} rows={3}/>
            <button type="submit" className="detail-note-submit" disabled={addingNote||!noteText.trim()}>
              {addingNote?<span className="detail-spinner"/>:<><MdSend size={15}/>Add Note</>}
            </button>
          </form>
          <div className="detail-notes-list">
            {lead.notes?.length>0?[...lead.notes].reverse().map(note=>(
              <div key={note._id} className="detail-note-item">
                <div className="detail-note-meta">
                  <span className="detail-note-author">{note.createdBy?.name||user?.name||'You'}</span>
                  <span className="detail-note-date">{new Date(note.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                <p className="detail-note-text">{note.text}</p>
                <button className="detail-note-delete" onClick={()=>handleDeleteNote(note._id)} disabled={deletingNote===note._id}><MdDeleteOutline size={15}/></button>
              </div>
            )):<div className="detail-notes-empty"><MdNote size={32}/><p>No notes yet.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeadDetailPage;
