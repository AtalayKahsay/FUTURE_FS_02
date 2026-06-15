import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdPeople, MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';
import toast from 'react-hot-toast';
import './LeadsPage.css';
const STATUSES=['','new','contacted','converted','lost'];
const SOURCES=['','website','referral','social_media','email_campaign','cold_call','other'];
const LeadsPage = () => {
  const navigate=useNavigate();
  const [leads,setLeads]=useState([]);const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');const [filters,setFilters]=useState({status:'',source:''});
  const [pagination,setPagination]=useState({page:1,totalPages:1,total:0});
  const [showFilters,setShowFilters]=useState(false);const [deletingId,setDeletingId]=useState(null);
  const fetchLeads=useCallback(async(page=1)=>{setLoading(true);try{const params={page,limit:10,...filters};if(search)params.search=search;const {data}=await api.get('/leads',{params});setLeads(data.leads);setPagination({page:data.currentPage,totalPages:data.totalPages,total:data.total});}catch{toast.error('Failed to load leads.');}finally{setLoading(false);}}, [filters,search]);
  useEffect(()=>{const t=setTimeout(()=>fetchLeads(1),400);return()=>clearTimeout(t);},[fetchLeads]);
  const handleDelete=async id=>{if(!window.confirm('Delete this lead?'))return;setDeletingId(id);try{await api.delete(`/leads/${id}`);toast.success('Deleted.');fetchLeads(pagination.page);}catch{toast.error('Failed.');}finally{setDeletingId(null);}};
  const hasFilters=filters.status||filters.source||search;
  return (
    <div className="leads-page">
      <div className="leads-toolbar">
        <div className="leads-search"><MdSearch className="leads-search__icon" size={18}/><input type="text" className="leads-search__input" placeholder="Search by name, email, company…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <button className={`leads-filter-btn${showFilters?' leads-filter-btn--active':''}`} onClick={()=>setShowFilters(p=>!p)}><MdFilterList size={18}/><span>Filters</span>{hasFilters&&<span className="leads-filter-dot"/>}</button>
        <Link to="/leads/add" className="leads-add-btn"><MdAdd size={18}/><span>Add Lead</span></Link>
      </div>
      {showFilters&&(
        <div className="leads-filter-panel"><div className="leads-filter-row">
          <div className="leads-filter-group"><label className="leads-filter-label">Status</label>
            <select className="leads-filter-select" value={filters.status} onChange={e=>setFilters(p=>({...p,status:e.target.value}))}>{STATUSES.map(s=><option key={s} value={s}>{s?s:'All statuses'}</option>)}</select>
          </div>
          <div className="leads-filter-group"><label className="leads-filter-label">Source</label>
            <select className="leads-filter-select" value={filters.source} onChange={e=>setFilters(p=>({...p,source:e.target.value}))}>{SOURCES.map(s=><option key={s} value={s}>{s?s.replace(/_/g,' '):'All sources'}</option>)}</select>
          </div>
          {hasFilters&&<button className="leads-clear-btn" onClick={()=>{setFilters({status:'',source:''});setSearch('');}}>Clear</button>}
        </div></div>
      )}
      <p className="leads-count">{pagination.total} lead{pagination.total!==1?'s':''} found</p>
      {loading?(<div className="leads-skel-list">{[...Array(5)].map((_,i)=><div key={i} className="leads-skel-row"/>)}</div>)
      :leads.length===0?(<div className="leads-empty"><MdPeople size={52}/><h3>No leads found</h3><p>{hasFilters?'Try adjusting filters.':'Add your first lead.'}</p><Link to="/leads/add" className="leads-empty-btn"><MdAdd size={16}/>Add Lead</Link></div>)
      :(
        <>
          <div className="leads-table-wrap"><table className="leads-table">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Source</th><th>Status</th><th>Priority</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>{leads.map(lead=>(
              <tr key={lead._id}>
                <td><Link to={`/leads/${lead._id}`} className="leads-table__name"><div className="leads-table__avatar">{lead.name.charAt(0).toUpperCase()}</div>{lead.name}</Link></td>
                <td className="leads-table__email">{lead.email}</td>
                <td>{lead.company||'—'}</td>
                <td><span className="leads-table__source">{lead.source.replace(/_/g,' ')}</span></td>
                <td><StatusBadge status={lead.status}/></td>
                <td><StatusBadge status={lead.priority} type="priority"/></td>
                <td className="leads-table__date">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td><div className="leads-table__actions">
                  <button className="leads-action-btn leads-action-btn--view" onClick={()=>navigate(`/leads/${lead._id}`)}><MdVisibility size={16}/></button>
                  <button className="leads-action-btn leads-action-btn--edit" onClick={()=>navigate(`/leads/${lead._id}/edit`)}><MdEdit size={16}/></button>
                  <button className="leads-action-btn leads-action-btn--delete" onClick={()=>handleDelete(lead._id)} disabled={deletingId===lead._id}><MdDelete size={16}/></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
          {pagination.totalPages>1&&(
            <div className="leads-pagination">
              <button className="pagination-btn" onClick={()=>fetchLeads(pagination.page-1)} disabled={pagination.page===1}><MdChevronLeft size={20}/></button>
              <span className="pagination-info">Page {pagination.page} of {pagination.totalPages}</span>
              <button className="pagination-btn" onClick={()=>fetchLeads(pagination.page+1)} disabled={pagination.page===pagination.totalPages}><MdChevronRight size={20}/></button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default LeadsPage;
